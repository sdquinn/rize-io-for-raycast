import { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast, ToastStyle, LocalStorage } from '@raycast/api';

const STOP_SESSION_MUTATION = `
  mutation StopSession($input: StopSessionTimerInput!) {
    stopSessionTimer(input: $input) {
      __typename
    }
  }
`;

export default function StopSession() {
  useEffect(() => {
    const stopSession = async () => {
      const storedAuthToken = await LocalStorage.getItem<string>('authToken');

      if (!storedAuthToken) {
        showToast(ToastStyle.Failure, 'Error', 'Authentication Token is required.');
        return;
      }

      try {
        const response = await axios.post(
          'https://api.rize.io/api/v1/graphql',
          {
            query: STOP_SESSION_MUTATION,
            variables: { input: {} },
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
          showToast(ToastStyle.Failure, 'Error', errors[0].message || 'An error occurred while stopping the session.');
          return;
        }

        showToast(ToastStyle.Success, 'Session Stopped', 'Session successfully stopped.');
      } catch (error) {
        showToast(ToastStyle.Failure, 'Error', 'An error occurred while stopping the session.');
        console.error('Error stopping session:', error);
      }
    };

    stopSession();
  }, []);

  return null;
}
