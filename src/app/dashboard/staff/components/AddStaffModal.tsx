"use client";
import { useState, useEffect } from 'react';
import { StaffMember } from '@/lib/supabase';

interface AddStaffModalProps {
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
  editStaff?: StaffMember | null;
  mode: 'add' | 'edit';
}

export default function AddStaffModal({ organizationId, onClose, onSuccess, editStaff, mode }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    hourly_wage: '0',
    guaranteed_hours: '0',
    employment_type: 'part-time',
    performance_score: '80',
    stations: '',
    phone: '',
    emergency_contact: '',
    start_date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when editing
  useEffect(() => {
    if (editStaff && mode === 'edit') {
      setFormData({
        first_name: editStaff.first_name || '',
        last_name: editStaff.last_name || '',
        email: editStaff.email || '',
        role: editStaff.role || '',
        hourly_wage: (editStaff.hourly_wage || 0).toString(),
        guaranteed_hours: (editStaff.guaranteed_hours || 0).toString(),
        employment_type: editStaff.employment_type || 'part-time',
        performance_score: (editStaff.performance_score || 80).toString(),
        stations: (editStaff.stations || []).join(', '),
        phone: editStaff.contact_info?.phone || '',
        emergency_contact: editStaff.contact_info?.emergency_contact || '',
        start_date: editStaff.start_date ? new Date(editStaff.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [editStaff, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        organization_id: organizationId,
        hourly_wage: parseFloat(formData.hourly_wage) || 0,
        guaranteed_hours: parseInt(formData.guaranteed_hours) || 0,
        performance_score: parseInt(formData.performance_score) || 80,
        stations: formData.stations.split(',').map(s => s.trim()).filter(Boolean),
        availability: {
          monday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          tuesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          wednesday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          thursday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          friday: { available: true, startTime: '09:00', endTime: '17:00', preferred: false },
          saturday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false },
          sunday: { available: false, startTime: '09:00', endTime: '17:00', preferred: false }
        },
        contact_info: {
          phone: formData.phone,
          emergency_contact: formData.emergency_contact
        },
        status: 'active'
      };

      const url = mode === 'edit' ? `/api/staff/${editStaff?.id}` : '/api/staff';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error || 'Failed to save staff member'}`);
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      setError('Failed to save staff member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g., Server, Chef, Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hourly Wage
              </label>
              <input
                type="number"
                name="hourly_wage"
                value={formData.hourly_wage}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Guaranteed Hours
              </label>
              <input
                type="number"
                name="guaranteed_hours"
                value={formData.guaranteed_hours}
                onChange={handleChange}
                min="0"
                max="168"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Performance Score
              </label>
              <input
                type="number"
                name="performance_score"
                value={formData.performance_score}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Stations (comma-separated)
            </label>
            <input
              type="text"
              name="stations"
              value={formData.stations}
              onChange={handleChange}
              placeholder="e.g., Kitchen, Front of House, Bar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Name and relationship"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Staff Member' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
