import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Card, Button } from '../components/UI';
import {
  FaRobot,
  FaCalendarAlt,
  FaPills,
  FaHeartbeat,
  FaUser,
} from 'react-icons/fa';

/**
 * Dashboard Page
 * Main landing page after login
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const features = [
    {
      icon: FaRobot,
      title: 'AI Healthcare Assistant',
      description: 'Chat with our AI for health advice and symptom analysis',
      color: 'bg-blue-100 dark:bg-blue-900',
      action: () => navigate('/chatbot'),
    },
    {
      icon: FaCalendarAlt,
      title: 'Book Appointments',
      description: 'Schedule appointments with top-rated doctors',
      color: 'bg-green-100 dark:bg-green-900',
      action: () => navigate('/appointments'),
    },
    {
      icon: FaPills,
      title: 'Medicine Database',
      description: 'Search comprehensive medicine information',
      color: 'bg-purple-100 dark:bg-purple-900',
      action: () => navigate('/medicines'),
    },
    {
      icon: FaHeartbeat,
      title: 'Health Dashboard',
      description: 'Track your vitals and health records',
      color: 'bg-red-100 dark:bg-red-900',
      action: () => navigate('/health'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {user?.fullName}!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your personal healthcare assistant is ready to help
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Quick Stats */}
        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account Type
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {user?.role}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email
            </p>
            <p className="mt-2 truncate text-lg font-semibold text-gray-900 dark:text-white">
              {user?.email}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Member Since
            </p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account Status
            </p>
            <div className="mt-2 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Our Services
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx}>
                  <div className="flex items-start">
                    <div className={`rounded-lg ${feature.color} p-3`}>
                      <Icon size={24} className="text-primary-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                      <Button
                        onClick={feature.action}
                        variant="primary"
                        size="sm"
                        className="mt-4"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-12 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-6 dark:bg-yellow-900">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            ⚠️ Important Medical Disclaimer
          </h3>
          <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-200">
            This AI assistant provides informational support only and does not replace
            professional medical advice, diagnosis, or treatment. Always consult with a
            licensed healthcare provider for medical concerns. In case of emergency,
            please call your local emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
