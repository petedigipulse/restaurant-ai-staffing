'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseService } from '@/lib/services/database';

interface RoleStation {
  id: string;
  name: string;
  type: 'role' | 'station';
  description: string;
  default_hourly_wage: number;
  min_staffing_level: number;
  max_staffing_level: number;
  required_skills: string[];
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function RolesStationsPage() {
  const { data: session } = useSession();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [rolesStations, setRolesStations] = useState<RoleStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RoleStation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'station' as 'role' | 'station',
    description: '',
    default_hourly_wage: 25.00,
    min_staffing_level: 1,
    max_staffing_level: 5,
    required_skills: [''],
    color: '#3B82F6',
    is_active: true
  });

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.email) return;

      try {
        const orgId = await DatabaseService.getCurrentUserOrganizationId();
        if (orgId) {
          setOrganizationId(orgId);
          await loadRolesStations(orgId);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session]);

  const loadRolesStations = async (orgId: string) => {
    try {
      // For now, we'll use mock data until we implement the database service
      const mockData: RoleStation[] = [
        {
          id: '1',
          name: 'Kitchen',
          type: 'station',
          description: 'Food preparation and cooking area',
          default_hourly_wage: 25.00,
          min_staffing_level: 2,
          max_staffing_level: 5,
          required_skills: ['cooking', 'food safety', 'kitchen operations'],
          color: '#EF4444',
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Front of House',
          type: 'station',
          description: 'Customer service and dining area',
          default_hourly_wage: 20.00,
          min_staffing_level: 2,
          max_staffing_level: 6,
          required_skills: ['customer service', 'communication', 'point of sale'],
          color: '#3B82F6',
          is_active: true,
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bar',
          type: 'station',
          description: 'Beverage service and bar area',
          default_hourly_wage: 22.00,
          min_staffing_level: 1,
          max_staffing_level: 3,
          required_skills: ['bartending', 'alcohol service', 'customer service'],
          color: '#8B5CF6',
          is_active: true,
          sort_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Host',
          type: 'station',
          description: 'Greeting and seating guests',
          default_hourly_wage: 18.00,
          min_staffing_level: 1,
          max_staffing_level: 2,
          required_skills: ['customer service', 'organization', 'communication'],
          color: '#10B981',
          is_active: true,
          sort_order: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setRolesStations(mockData);
    } catch (error) {
      console.error('Error loading roles and stations:', error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      type: 'station',
      description: '',
      default_hourly_wage: 25.00,
      min_staffing_level: 1,
      max_staffing_level: 5,
      required_skills: [''],
      color: '#3B82F6',
      is_active: true
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: RoleStation) => {
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description,
      default_hourly_wage: item.default_hourly_wage,
      min_staffing_level: item.min_staffing_level,
      max_staffing_level: item.max_staffing_level,
      required_skills: [...item.required_skills],
      color: item.color,
      is_active: item.is_active
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!organizationId) return;

    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...editingItem, ...formData };
        setRolesStations(prev => 
          prev.map(item => item.id === editingItem.id ? updatedItem : item)
        );
      } else {
        // Add new item
        const newItem: RoleStation = {
          id: Date.now().toString(),
          ...formData,
          sort_order: rolesStations.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setRolesStations(prev => [...prev, newItem]);
      }

      setShowAddModal(false);
      setEditingItem(null);
      // TODO: Save to database when service is implemented
    } catch (error) {
      console.error('Error saving role/station:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role/station?')) {
      setRolesStations(prev => prev.filter(item => item.id !== id));
      // TODO: Delete from database when service is implemented
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      required_skills: [...prev.required_skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.map((skill, i) => 
        i === index ? value : skill
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Roles & Stations Management
          </h1>
          <p className="text-gray-600">
            Define and customize staff roles, stations, and requirements for your business.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Role/Station
            </button>
          </div>
        </div>

        {/* Roles and Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesStations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'role' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Default Wage:</span>
                  <span className="font-medium">${item.default_hourly_wage}/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Staffing:</span>
                  <span className="font-medium">{item.min_staffing_level}-{item.max_staffing_level}</span>
                </div>
              </div>

              {/* Skills */}
              {item.required_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-400">
                  Order: {item.sort_order}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingItem ? 'Edit' : 'Add New'} Role/Station
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'role' | 'station' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="station">Station</option>
                        <option value="role">Role</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Hourly Wage
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.default_hourly_wage}
                        onChange={(e) => setFormData(prev => ({ ...prev, default_hourly_wage: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Staffing
                      </label>
                      <input
                        type="number"
                        value={formData.min_staffing_level}
                        onChange={(e) => setFormData(prev => ({ ...prev, min_staffing_level: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Staffing
                      </label>
                      <input
                        type="number"
                        value={formData.max_staffing_level}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_staffing_level: parseInt(e.target.value) || 5 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Required Skills
                      </label>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        + Add Skill
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.required_skills.map((skill, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter skill"
                          />
                          {formData.required_skills.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {editingItem ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
