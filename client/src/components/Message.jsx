import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries'; // Adjust the import paths as needed
import { MUTATION_SAVE_CONVERSATION } from '../utils/mutations'; // Adjust the import paths as needed

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const [saveConversation] = useMutation(MUTATION_SAVE_CONVERSATION);
  const { data: meData } = useQuery(QUERY_ME); // Query to get the current user

  const userId = meData?.me?._id;

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket('ws://localhost:3001');

      ws.current.onmessage = event => {
        // Only handle text messages
        if (typeof event.data === 'string') {
          try {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
          } catch (error) {
            console.error('Received invalid JSON message:', event.data);
          }
        }
      };

      ws.current.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      ws.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      };

      ws.current.onerror = error => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        // Create a JSON message
        const message = {
          senderId: userId,
          //recipientId: 'some-recipient-id', // Replace with actual recipient ID or logic
          text: input,
        };
        ws.current.send(JSON.stringify(message));
        setMessages(prevMessages => [...prevMessages, message]);
        setInput('');
      } else {
        console.warn('WebSocket is not open. Message not sent.');
      }
    }
  };

  const handleSaveConversation = async () => {
    if (userId) {
      try {
        await saveConversation({
          variables: {
            messages: messages.map(msg => ({
              senderId: userId,
              //recipientId: 'some-recipient-id', // Replace with actual recipient ID or logic
              message: msg.text, // Adjust based on the message structure
            })),
          },
        });
        alert('Conversation saved successfully!');
      } catch (error) {
        console.error('Error saving conversation:', error);
        alert('Failed to save conversation.');
      }
    } else {
      alert('User not found. Cannot save conversation.');
    }
  };

  return (
    <div className="App">
      <h1>Online Messenger</h1>
      <div className="chat">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg.text} {/* Display message text */}
            </div>
          ))}
        </div>
        <div className="input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button onClick={handleSend}>Send</button>
          <button onClick={handleSaveConversation}>Save Conversation</button>
        </div>
      </div>
    </div>
  );
};

export default Message;