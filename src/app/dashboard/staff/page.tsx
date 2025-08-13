"use client";
import { useState, useEffect } from "react";
import StaffProfile from "./components/StaffProfile";
import EditStaffModal from "./components/EditStaffModal";
import CSVImport from "./components/CSVImport";
import AddStaffModal from "./components/AddStaffModal";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  hourlyWage: number;
  guaranteedHours: number;
  stations: string[];
  employmentType: 'full-time' | 'part-time' | 'casual';
  performanceScore: number;
  availability: {
    [key: string]: {
      available: boolean;
      startTime: string;
      endTime: string;
      preferred: boolean;
    };
  };
  contactInfo: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export default function StaffDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [employmentFilter, setEmploymentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof StaffMember>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get organization ID from localStorage and fetch staff data
  useEffect(() => {
    const storedOrgId = localStorage.getItem('organizationId');
    console.log('Staff page - storedOrgId from localStorage:', storedOrgId);
    
    // Use a consistent organization ID for now - this should match what's in the database
    let orgId = storedOrgId;
    
    if (!orgId || orgId === 'mock-org-123') {
      // Use a consistent ID that matches the working schedule system
      orgId = '21bf260b-8b4c-48c5-b370-836571619abc';
      console.log('Staff page - using consistent organization ID:', orgId);
      localStorage.setItem('organizationId', orgId);
    }
    
    setOrganizationId(orgId);
    fetchStaffData(orgId);
  }, []);

  // Debug modal state
  useEffect(() => {
    console.log('Modal state changed:', { showCSVImport, organizationId });
  }, [showCSVImport, organizationId]);

  const fetchStaffData = async (orgId: string) => {
    try {
      const response = await fetch(`/api/staff?organizationId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform database format to frontend format
        const transformedStaff = data.staff.map((member: any) => ({
          id: member.id,
          firstName: member.first_name,
          lastName: member.last_name,
          role: member.role,
          hourlyWage: member.hourly_wage,
          guaranteedHours: member.guaranteed_hours,
          stations: member.stations || [],
          employmentType: member.employment_type,
          performanceScore: member.performance_score,
          availability: member.availability || {},
          contactInfo: {
            email: member.email,
            phone: member.contact_info?.phone || '',
            emergencyContact: member.contact_info?.emergency_contact || ''
          },
          startDate: member.start_date,
          status: member.status
        }));
        setStaffData(transformedStaff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort staff data
  const filteredAndSortedStaff = staffData.filter(staff => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    const matchesEmployment = employmentFilter === "all" || staff.employmentType === employmentFilter;
    
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

  const uniqueRoles = Array.from(new Set(staffData.map(staff => staff.role)));
  const uniqueStatuses = Array.from(new Set(staffData.map(staff => staff.status)));
  const uniqueEmploymentTypes = Array.from(new Set(staffData.map(staff => staff.employmentType)));

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

  const handleViewProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedStaff(null);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setShowEditModal(true);
    handleCloseProfile();
  };

  const handleSaveEdit = async (updatedStaff: StaffMember) => {
    try {
      // In a real app, this would save to your backend
      console.log('Saving updated staff member:', updatedStaff);
      
      // Update the local data
      setStaffData(prev => prev.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      ));
      
      setShowEditModal(false);
      setEditingStaff(null);
    } catch (error) {
      console.error('Error saving staff member:', error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingStaff(null);
  };

  const handleCSVImportSuccess = () => {
    // Refresh staff data after successful import
    if (organizationId) {
      fetchStaffData(organizationId);
    }
    setShowCSVImport(false);
  };

  const handleAddStaffSuccess = () => {
    // Refresh staff data after successful addition
    if (organizationId) {
      fetchStaffData(organizationId);
    }
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
            onClick={() => {
              // Clear localStorage and generate new UUID
              console.log('Before reset - organizationId:', organizationId);
              console.log('Before reset - localStorage:', localStorage.getItem('organizationId'));
              
              // Clear all potential sources
              localStorage.removeItem('organizationId');
              localStorage.removeItem('mock-org-123');
              sessionStorage.removeItem('organizationId');
              
              // Generate new UUID
              const newOrgId = crypto.randomUUID();
              setOrganizationId(newOrgId);
              localStorage.setItem('organizationId', newOrgId);
              
              console.log('Reset organization ID to:', newOrgId);
              console.log('After reset - localStorage:', localStorage.getItem('organizationId'));
              
              // Force refresh the page to ensure clean state
              window.location.reload();
            }}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Reset Org ID & Reload
          </button>
          <button
            onClick={() => {
              console.log('CSV Import button clicked');
              console.log('organizationId:', organizationId);
              console.log('organizationId type:', typeof organizationId);
              console.log('organizationId length:', organizationId?.length);
              console.log('showCSVImport before:', showCSVImport);
              setShowCSVImport(true);
              console.log('showCSVImport after:', true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={() => setShowAddStaff(true)}
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
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="role">Role</option>
          <option value="hourlyWage">Hourly Wage</option>
          <option value="performanceScore">Performance Score</option>
          <option value="startDate">Start Date</option>
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
        Showing {filteredAndSortedStaff.length} of {staffData.length} staff members
      </div>

      {/* Staff Grid */}
      {staffData.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
          <p className="text-gray-500 mb-4">
            Get started by importing staff from CSV or adding them individually
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowCSVImport(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Import CSV
            </button>
            <button
              onClick={() => setShowAddStaff(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Staff Member
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
                  <h3 className="text-lg font-semibold">{staff.firstName} {staff.lastName}</h3>
                  <p className="text-muted-foreground">{staff.role}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                    {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(staff.employmentType)}`}>
                    {staff.employmentType.charAt(0).toUpperCase() + staff.employmentType.slice(1)}
                  </span>
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Performance:</span>
                  <span className={`font-medium ${getPerformanceColor(staff.performanceScore)}`}>
                    {staff.performanceScore}/100
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hourly Rate:</span>
                  <span className="font-medium">${staff.hourlyWage}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Guaranteed Hours:</span>
                  <span className="font-medium">{staff.guaranteedHours}h/week</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{new Date(staff.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stations */}
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Stations: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {staff.stations.map((station, index) => (
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
                  <div>{staff.contactInfo.email}</div>
                  <div>{staff.contactInfo.phone}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewProfile(staff)}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => {
                    setEditingStaff(staff);
                    setShowEditModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {staffData.length > 0 && filteredAndSortedStaff.length === 0 && (
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

      {/* Staff Profile Modal */}
      {showProfile && selectedStaff && (
        <StaffProfile
          staff={selectedStaff}
          onClose={handleCloseProfile}
          onEdit={handleEditStaff}
        />
      )}

      {/* Edit Staff Modal */}
      {showEditModal && editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}

      {/* CSV Import Modal */}
      {showCSVImport && organizationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Import Staff from CSV</h2>
              <button
                onClick={() => setShowCSVImport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CSVImport
              organizationId={organizationId}
              onImportSuccess={handleCSVImportSuccess}
            />
            {/* Debug info */}
            <div className="p-4 text-xs text-gray-500">
              Debug: organizationId = {organizationId}
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && organizationId && (
        <AddStaffModal
          organizationId={organizationId}
          onClose={() => setShowAddStaff(false)}
          onSuccess={handleAddStaffSuccess}
        />
      )}
    </div>
  );
}
