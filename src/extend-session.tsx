import { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast, ToastStyle, LocalStorage, Form, ActionPanel, Action } from '@raycast/api';

const EXTEND_SESSION_MUTATION = `
  mutation ExtendSession($input: ExtendCurrentSessionInput!) {
    extendCurrentSession(input: $input) {
      session {
        id
      }
    }
  }
`;

export default function ExtendSession() {
  const [length, setLength] = useState(300); // Default to 300 seconds (5 minutes)

  const handleSubmit = async () => {
    const storedAuthToken = await LocalStorage.getItem<string>('authToken');

    if (!storedAuthToken) {
      showToast(ToastStyle.Failure, 'Error', 'Authentication Token is required.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.rize.io/api/v1/graphql',
        {
          query: EXTEND_SESSION_MUTATION,
          variables: { input: { length } },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedAuthToken}`,
          },
        }
      );

      console.log('Response:', JSON.stringify(response.data, null, 2));
      const { data, errors } = response.data;

      if (errors) {
        showToast(ToastStyle.Failure, 'Error', errors[0].message || 'An error occurred while extending the session.');
        return;
      }

      showToast(ToastStyle.Success, 'Session Extended', 'Session successfully extended.');
    } catch (error) {
      showToast(ToastStyle.Failure, 'Error', 'An error occurred while extending the session.');
      console.error('Error extending session:', error);
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Extend Session" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="length" title="Extend Length (Minutes)" value={length.toString()} onChange={(newValue) => setLength(parseInt(newValue) * 60)}>
        <Form.Dropdown.Item value="5" title="5 Minutes" />
        <Form.Dropdown.Item value="10" title="10 Minutes" />
        <Form.Dropdown.Item value="15" title="15 Minutes" />
        <Form.Dropdown.Item value="30" title="30 Minutes" />
        <Form.Dropdown.Item value="60" title="60 Minutes" />
      </Form.Dropdown>
    </Form>
  );
}