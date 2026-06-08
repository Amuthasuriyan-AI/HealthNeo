import React, { useState } from 'react';
import { useChatStore } from '../context/store';
import { apiService } from '../services/api';
import { Button, Card, LoadingSpinner, Alert } from '../components/UI';
import { useAuth } from '../hooks';

/**
 * Chatbot Page
 * AI-powered healthcare chatbot interface
 */
export const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const { currentSession, addMessage } = useChatStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  React.useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await apiService.startChatSession();
      setSessionId(response.data.data.sessionId);
      setMessages([]);
    } catch (err: any) {
      setError('Failed to start chat session');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !sessionId) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    // Add user message to UI
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      setLoading(true);
      const response = await apiService.sendChatMessage(
        userMessage,
        sessionId
      );
      const aiMessage = {
        role: 'assistant',
        content: response.data.data.aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          MediBot AI Healthcare Assistant
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Chat with our AI assistant about health concerns and medical advice
        </p>
      </div>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="mx-6 mt-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900">
          <div className="flex justify-between items-start">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Medical Disclaimer:</strong>
              <p className="mt-2">
                This AI assistant provides informational support only and does
                not replace professional medical advice, diagnosis, or treatment.
                Always consult with a licensed healthcare provider for medical concerns.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="ml-4 text-yellow-800 hover:text-yellow-900 dark:text-yellow-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome to MediBot AI
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Ask me about symptoms, medicines, health tips, and more!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`mt-1 text-xs ${
                  msg.role === 'user'
                    ? 'text-primary-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-200 px-4 py-3 dark:bg-gray-700">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-600"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-600"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !input.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
