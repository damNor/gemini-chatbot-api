document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  const addMessageToChatbox = (text, sender) => {
    const messageElement = document.createElement('div');
    // Use class names from style.css
    messageElement.className = `chat-message ${sender}`;
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  };

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) {
      return;
    }

    // 1. Add the user's message to the chat box
    addMessageToChatbox(userMessage, 'user');
    userInput.value = '';

    // 2. Show a temporary "Thinking..." bot message
    const thinkingMessageElement = addMessageToChatbox('Thinking...', 'bot');

    try {
      // 3. Send the user's message as a POST request to /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: [{ role: 'user', text: userMessage }],
        }),
      });

      // 4. When the response arrives, handle it
      if (!response.ok) {
        thinkingMessageElement.textContent = 'Failed to get response from server.';
        thinkingMessageElement.classList.add('error');
        return;
      }

      const data = await response.json();

      if (data && data.result) {
        // Replace the "Thinking..." message with the AI's reply
        thinkingMessageElement.textContent = data.result;
      } else {
        // If an error occurs or no result is received, show an error message
        thinkingMessageElement.textContent = 'Sorry, no response received.';
        thinkingMessageElement.classList.add('error');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      thinkingMessageElement.textContent = 'Failed to get response from server.';
      thinkingMessageElement.classList.add('error');
    } finally {
      // Ensure the chat box is scrolled to the bottom
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
});