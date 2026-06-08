import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import { apiService } from '../services/api';
import { Card, Button, Input, Alert, LoadingSpinner } from '../components/UI';
import { HealthRecord } from '../types';

/**
 * Health Dashboard
 * Track health vitals, BMI, and health records
 */
export const HealthDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vitals' | 'bmi' | 'records'>(
    'vitals'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestVitals, setLatestVitals] = useState<HealthRecord | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [bmiData, setBmiData] = useState({
    weight: '',
    height: '',
  });
  const [bmiResult, setBmiResult] = useState<any>(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const [vitalsRes, recordsRes] = await Promise.all([
        apiService.getLatestVitals(),
        apiService.getUserHealthRecords(),
      ]);
      setLatestVitals(vitalsRes.data.data);
      setHealthRecords(recordsRes.data.data.records);
    } catch (err: any) {
      setError('Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmiData.weight || !bmiData.height) {
      setError('Please enter both weight and height');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.calculateBMI(
        Number(bmiData.weight),
        Number(bmiData.height)
      );
      setBmiResult(response.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to calculate BMI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Health Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your health vitals and medical records
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('vitals')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'vitals'
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Latest Vitals
        </button>
        <button
          onClick={() => setActiveTab('bmi')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'bmi'
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          BMI Calculator
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'records'
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Health Records
        </button>
      </div>

      {/* Latest Vitals Tab */}
      {activeTab === 'vitals' && (
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : latestVitals ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weight
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {latestVitals.data.weight} kg
                </p>
              </Card>
              {latestVitals.data.height && (
                <Card>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Height
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {latestVitals.data.height} cm
                  </p>
                </Card>
              )}
              {latestVitals.data.bmi && (
                <Card>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    BMI
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {latestVitals.data.bmi}
                  </p>
                </Card>
              )}
              {latestVitals.data.bloodPressure && (
                <Card>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Blood Pressure
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {latestVitals.data.bloodPressure}
                  </p>
                </Card>
              )}
              {latestVitals.data.heartRate && (
                <Card>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Heart Rate
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {latestVitals.data.heartRate} bpm
                  </p>
                </Card>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No vitals recorded yet
            </p>
          )}
        </div>
      )}

      {/* BMI Calculator Tab */}
      {activeTab === 'bmi' && (
        <Card>
          <form onSubmit={handleCalculateBMI} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="number"
                label="Weight (kg)"
                placeholder="Enter weight in kg"
                value={bmiData.weight}
                onChange={(e) =>
                  setBmiData((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
              <Input
                type="number"
                label="Height (cm)"
                placeholder="Enter height in cm"
                value={bmiData.height}
                onChange={(e) =>
                  setBmiData((prev) => ({ ...prev, height: e.target.value }))
                }
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              Calculate BMI
            </Button>
          </form>

          {bmiResult && (
            <div className="mt-6 rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4 dark:bg-primary-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                BMI Result
              </h3>
              <p className="mt-2 text-3xl font-bold text-primary-500">
                {bmiResult.bmi}
              </p>
              <p className="mt-1 text-lg text-gray-700 dark:text-gray-300">
                {bmiResult.category}
              </p>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>BMI Categories:</strong>
                </p>
                <ul className="mt-2 space-y-1">
                  <li>Underweight: BMI less than 18.5</li>
                  <li>Normal weight: BMI 18.5 - 24.9</li>
                  <li>Overweight: BMI 25 - 29.9</li>
                  <li>Obese: BMI 30 or greater</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Health Records Tab */}
      {activeTab === 'records' && (
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : healthRecords.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No health records found
            </p>
          ) : (
            <div className="space-y-4">
              {healthRecords.map((record) => (
                <Card key={record._id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {record.recordType} Record
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(record.recordDate).toLocaleDateString()}
                      </p>
                      <div className="mt-3 text-sm">
                        {Object.entries(record.data).map(([key, value]) => (
                          <p key={key}>
                            <strong className="capitalize">{key}:</strong> {String(value)}
                          </p>
                        ))}
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <strong>Notes:</strong> {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
