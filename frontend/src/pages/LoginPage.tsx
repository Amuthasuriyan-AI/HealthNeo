import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Input, Button, Alert } from '../components/UI';

/**
 * Login Page
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (_error) {
      // Error is already set in useAuth hook
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MediBot AI
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Healthcare Assistant Login
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setValidationError('')}
          />
        )}

        {validationError && (
          <Alert
            type="error"
            message={validationError}
            onClose={() => setValidationError('')}
          />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
