import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button, Card, LoadingSpinner, Alert, Modal } from '../components/UI';
import { Doctor, Appointment } from '../types';

/**
 * Appointments Page
 * Manage doctor appointments and bookings
 */
export const AppointmentsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments'>(
    'doctors'
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    startTime: '',
    reason: '',
  });

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDoctors();
      setDoctors(response.data.data.doctors);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await apiService.getUserAppointments();
      setAppointments(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingData.appointmentDate || !bookingData.startTime) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await apiService.bookAppointment({
        doctorId: selectedDoctor._id,
        ...bookingData,
        endTime: addMinutes(bookingData.startTime, 30),
      });
      setShowBookingModal(false);
      setBookingData({ appointmentDate: '', startTime: '', reason: '' });
      await fetchAppointments();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <div className="space-y-6 p-6">
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
          onClick={() => setActiveTab('doctors')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'doctors'
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Find Doctors
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'appointments'
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          My Appointments
        </button>
      </div>

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No doctors available
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor._id}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doctor.fullName}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {doctor.specialization}
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>Experience:</strong> {doctor.experience} years
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>Fee:</strong> ₹{doctor.consultationFee}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">
                      {doctor.rating} ({doctor.totalRatings} ratings)
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Book Appointment
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No appointments scheduled
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <Card key={apt._id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dr. {apt.doctorDetails?.fullName || 'Unknown'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(apt.appointmentDate).toLocaleDateString()} at{' '}
                        {apt.startTime}
                      </p>
                      <p className="mt-1 text-sm">
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                      <span
                        className={`mt-2 inline-block rounded px-3 py-1 text-xs font-medium ${
                          apt.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        title={`Book Appointment - Dr. ${selectedDoctor?.fullName}`}
        onClose={() => setShowBookingModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Appointment Date
            </label>
            <input
              type="date"
              value={bookingData.appointmentDate}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  appointmentDate: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Time
            </label>
            <input
              type="time"
              value={bookingData.startTime}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Reason for Visit
            </label>
            <textarea
              value={bookingData.reason}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <Button
            onClick={handleBookAppointment}
            variant="primary"
            isLoading={loading}
            className="w-full"
          >
            Confirm Booking
          </Button>
        </div>
      </Modal>
    </div>
  );
};
