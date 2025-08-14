"use client";
import { useState, useEffect } from "react";
import { DatabaseService } from "@/lib/services/database";
import { StaffMember } from "@/lib/supabase";
import AddStaffModal from "./components/AddStaffModal";

export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [employmentFilter, setEmploymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof StaffMember>("first_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Load staff data from database
  useEffect(() => {
    const loadStaffData = async () => {
      try {
        setIsLoading(true);
        
        // Get organization ID for the current authenticated user
        const currentOrgId = await DatabaseService.getCurrentUserOrganizationId();
        if (!currentOrgId) {
          console.error('No organization ID found for current user');
          setIsLoading(false);
          return;
        }
        
        setOrganizationId(currentOrgId);
        
        // Load staff members
        const staff = await DatabaseService.getStaffMembers(currentOrgId);
        setStaffMembers(staff || []);
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffData();
  }, []);

  // Handle CSV import
  const handleCSVImport = async () => {
    if (!csvFile || !organizationId) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await fetch('/api/staff/import', {
        method: 'POST',
        headers: {
          'x-organization-id': organizationId,
        },
        body: csvFile
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully imported ${result.imported} staff members!`);
        
        // Reload staff data
        const staff = await DatabaseService.getStaffMembers(organizationId);
        setStaffMembers(staff || []);
        
        // Reset form
        setCsvFile(null);
        setShowImportModal(false);
      } else {
        const error = await response.json();
        alert(`Import failed: ${error.error}`);
      }
    } catch (error) {
      console.error('CSV import error:', error);
      alert('Failed to import CSV. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const headers = [
      'first_name',
      'last_name', 
      'email',
      'role',
      'hourly_wage',
      'guaranteed_hours',
      'employment_type',
      'performance_score',
      'stations',
      'phone',
      'emergency_contact',
      'start_date'
    ];
    
    const sampleData = [
      'John',
      'Smith',
      'john.smith@restaurant.com',
      'Server',
      '25.00',
      '20',
      'part-time',
      '85',
      'Front of House,Bar',
      '+1234567890',
      'Jane Smith (Spouse)',
      '2024-01-15'
    ];
    
    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle successful staff addition
  const handleStaffAdded = async () => {
    if (organizationId) {
      const staff = await DatabaseService.getStaffMembers(organizationId);
      setStaffMembers(staff || []);
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setModalMode('edit');
    setShowAddStaffModal(true);
  };

  const handleAddNewStaff = () => {
    setEditingStaff(null);
    setModalMode('add');
    setShowAddStaffModal(true);
  };

  const handleCloseModal = () => {
    setShowAddStaffModal(false);
    setEditingStaff(null);
    setModalMode('add');
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the staff member from the local state
        setStaffMembers(prev => prev.filter(staff => staff.id !== staffId));
        console.log('✅ Staff member deleted successfully');
      } else {
        const error = await response.json();
        alert(`Error deleting staff member: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Failed to delete staff member. Please try again.');
    }
  };

  // Filter and sort staff data
  const filteredAndSortedStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    const matchesEmployment = employmentFilter === "all" || staff.employment_type === employmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesEmployment;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const uniqueRoles = Array.from(new Set(staffMembers.map(staff => staff.role).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(staffMembers.map(staff => staff.status).filter(Boolean)));
  const uniqueEmploymentTypes = Array.from(new Set(staffMembers.map(staff => staff.employment_type).filter(Boolean)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-purple-100 text-purple-800';
      case 'casual': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Directory</h1>
          <p className="text-muted-foreground">
            Manage your restaurant staff, view performance, and track availability
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add New Staff
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Status</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
        
        <select
          value={employmentFilter}
          onChange={(e) => setEmploymentFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Types</option>
          {uniqueEmploymentTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as keyof StaffMember)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="role">Role</option>
          <option value="hourly_wage">Hourly Wage</option>
          <option value="performance_score">Performance Score</option>
          <option value="start_date">Start Date</option>
        </select>
        
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
        >
          {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      {/* Staff Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedStaff.length} of {staffMembers.length} staff members
      </div>

      {/* Staff Grid */}
      {staffMembers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
          <p className="text-gray-500 mb-4">
            Get started by adding your first staff member or importing a CSV file
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Staff Member
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Import CSV
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedStaff.map((staff) => (
            <div key={staff.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{staff.first_name} {staff.last_name}</h3>
                  <p className="text-muted-foreground">{staff.role}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status || 'active')}`}>
                    {(staff.status || 'active').charAt(0).toUpperCase() + (staff.status || 'active').slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(staff.employment_type || 'part-time')}`}>
                    {(staff.employment_type || 'part-time').charAt(0).toUpperCase() + (staff.employment_type || 'part-time').slice(1)}
                  </span>
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Performance:</span>
                  <span className={`font-medium ${getPerformanceColor(staff.performance_score || 80)}`}>
                    {staff.performance_score || 80}/100
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hourly Rate:</span>
                  <span className="font-medium">${staff.hourly_wage || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Guaranteed Hours:</span>
                  <span className="font-medium">{staff.guaranteed_hours || 0}h/week</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{new Date(staff.start_date || new Date()).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stations */}
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Stations: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(staff.stations || []).map((station, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                      {station}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-4 text-sm">
                <div className="text-muted-foreground mb-1">Contact:</div>
                <div className="space-y-1">
                  <div>{staff.email}</div>
                  <div>{staff.contact_info?.phone || 'No phone'}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {staffMembers.length > 0 && filteredAndSortedStaff.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No staff members found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
              setEmploymentFilter("all");
            }}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaffModal
          organizationId={organizationId}
          onClose={handleCloseModal}
          onSuccess={handleStaffAdded}
          editStaff={editingStaff}
          mode={modalMode}
        />
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Import Staff from CSV</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  CSV should include: first_name, last_name, email, role, hourly_wage, performance_score
                </p>
                <button
                  type="button"
                  onClick={downloadCSVTemplate}
                  className="text-sm text-blue-600 hover:text-blue-800 underline mt-2"
                >
                  Download CSV Template
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCSVImport}
                  disabled={!csvFile || isImporting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isImporting ? 'Importing...' : 'Import CSV'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
