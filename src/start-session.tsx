import { useState, useEffect } from 'react';
import axios from 'axios';
import { ActionPanel, Action, Form, showToast, ToastStyle, LocalStorage } from '@raycast/api';

const START_SESSION_MUTATION = `
  mutation startSessionTimer($input: StartSessionTimerInput!) {
    startSessionTimer(input: $input) {
      session {
        id
        title
      }
    }
  }
`;

export default function StartSession() {
  const [loading, setLoading] = useState(false);
  const [storedAuthToken, setStoredAuthToken] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState('focus');

  useEffect(() => {
    (async () => {
      const token = await LocalStorage.getItem<string>('authToken');
      setStoredAuthToken(token);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!storedAuthToken) {
      showToast(ToastStyle.Failure, 'Error', 'Authentication Token is required.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://api.rize.io/api/v1/graphql',
        {
          query: START_SESSION_MUTATION,
          variables: { input: { type: sessionType } },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedAuthToken}`,
          },
        }
      );

      setLoading(false);

      const session = response.data.data.startSessionTimer.session;
      if (session) {
        await LocalStorage.setItem('currentSessionId', session.id);
        showToast(ToastStyle.Success, 'Session Started', `Session ID: ${session.id}, Title: ${session.title}`);
      }
    } catch (error) {
      setLoading(false);
      showToast(ToastStyle.Failure, 'Error', 'An error occurred while starting the session.');
      console.error('Error starting session:', error);
    }
  };

  if (storedAuthToken) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Start Session" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.Dropdown id="sessionType" title="Session Type" value={sessionType} onChange={setSessionType}>
          <Form.Dropdown.Item value="focus" title="Focus" />
          <Form.Dropdown.Item value="meeting" title="Meeting" />
          <Form.Dropdown.Item value="break" title="Break" />
        </Form.Dropdown>
      </Form>
    );
  }

  return (
    <Form actions={<ActionPanel><Action.SubmitForm title="Save Token" onSubmit={() => {}} /></ActionPanel>}>
      <Form.TextField id="authToken" title="Authentication Token" placeholder="Enter your Rize Auth Token" onChange={async (newValue) => {
        await LocalStorage.setItem('authToken', newValue);
        setStoredAuthToken(newValue);
      }} />
    </Form>
  );
}