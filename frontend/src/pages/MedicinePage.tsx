import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Card, LoadingSpinner, Alert, Input, Button } from '../components/UI';
import { Medicine } from '../types';
import { useDebounce } from '../hooks';

/**
 * Medicine Page
 * Search and view medicine information
 */
export const MedicinePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchMedicines();
    } else {
      setMedicines([]);
    }
  }, [debouncedSearch]);

  const searchMedicines = async () => {
    if (!debouncedSearch.trim()) return;

    try {
      setLoading(true);
      const response = await apiService.searchMedicines(debouncedSearch);
      setMedicines(response.data.data.medicines);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Medicine Information
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Search our comprehensive medicine database
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div>
        <Input
          type="text"
          placeholder="Search by medicine name, brand, or generic name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Search Medicines"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : medicines.length === 0 && debouncedSearch ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No medicines found
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {medicines.map((medicine) => (
            <Card key={medicine._id}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {medicine.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Generic:</strong> {medicine.genericName}
              </p>
              <p className="text-sm">
                <strong>Brand:</strong> {medicine.brand}
              </p>
              <p className="mt-2 text-sm">
                <strong>Strength:</strong> {medicine.strength}
              </p>
              <p className="text-sm">
                <strong>Form:</strong> {medicine.formulation}
              </p>
              <p className="mt-2 text-sm">
                <strong>Dosage:</strong> {medicine.dosage.amount} {medicine.dosage.frequency}
              </p>
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-primary-500">
                    View Details
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Side Effects:</strong>
                      <ul className="mt-1 list-inside list-disc">
                        {medicine.sideEffects.slice(0, 3).map((effect, idx) => (
                          <li key={idx} className="text-xs">
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Warnings:</strong>
                      <ul className="mt-1 list-inside list-disc">
                        {medicine.warnings.slice(0, 2).map((warning, idx) => (
                          <li key={idx} className="text-xs">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
              {medicine.price && (
                <p className="mt-4 text-lg font-bold text-primary-500">
                  ₹{medicine.price}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
