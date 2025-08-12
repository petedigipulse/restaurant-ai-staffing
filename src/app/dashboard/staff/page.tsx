"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import StaffProfile from "./components/StaffProfile";
import EditStaffModal from "./components/EditStaffModal";

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

  // Mock staff data - in a real app, this would come from your backend
  const staffData: StaffMember[] = [
    {
      id: "S101",
      firstName: "Emily",
      lastName: "Chen",
      role: "FOH Manager",
      hourlyWage: 32,
      guaranteedHours: 40,
      stations: ["Host", "Server", "Cashier"],
      employmentType: "full-time",
      performanceScore: 95,
      availability: {
        monday: { available: true, startTime: "09:00", endTime: "17:00", preferred: true },
        tuesday: { available: true, startTime: "09:00", endTime: "17:00", preferred: true },
        wednesday: { available: true, startTime: "09:00", endTime: "17:00", preferred: true },
        thursday: { available: true, startTime: "09:00", endTime: "17:00", preferred: true },
        friday: { available: true, startTime: "09:00", endTime: "17:00", preferred: true },
        saturday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false },
        sunday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false }
      },
      contactInfo: {
        email: "emily.chen@restaurant.com",
        phone: "+1 (555) 123-4567",
        emergencyContact: "David Chen (Spouse) +1 (555) 123-4568"
      },
      startDate: "2023-01-15",
      status: "active"
    },
    {
      id: "S102",
      firstName: "Mai",
      lastName: "Kanako",
      role: "Barista",
      hourlyWage: 26,
      guaranteedHours: 25,
      stations: ["Coffee Bar", "Cashier"],
      employmentType: "part-time",
      performanceScore: 92,
      availability: {
        monday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false },
        tuesday: { available: true, startTime: "10:00", endTime: "16:00", preferred: true },
        wednesday: { available: true, startTime: "10:00", endTime: "16:00", preferred: true },
        thursday: { available: true, startTime: "10:00", endTime: "16:00", preferred: true },
        friday: { available: true, startTime: "10:00", endTime: "16:00", preferred: true },
        saturday: { available: true, startTime: "09:00", endTime: "18:00", preferred: true },
        sunday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false }
      },
      contactInfo: {
        email: "mai.kanako@restaurant.com",
        phone: "+1 (555) 234-5678",
        emergencyContact: "Yuki Kanako (Parent) +1 (555) 234-5679"
      },
      startDate: "2023-03-20",
      status: "active"
    },
    {
      id: "S103",
      firstName: "Alan",
      lastName: "James",
      role: "Host",
      hourlyWage: 25.5,
      guaranteedHours: 20,
      stations: ["Host", "Busser"],
      employmentType: "part-time",
      performanceScore: 88,
      availability: {
        monday: { available: true, startTime: "16:00", endTime: "22:00", preferred: true },
        tuesday: { available: true, startTime: "16:00", endTime: "22:00", preferred: true },
        wednesday: { available: true, startTime: "16:00", endTime: "22:00", preferred: true },
        thursday: { available: true, startTime: "16:00", endTime: "22:00", preferred: true },
        friday: { available: true, startTime: "16:00", endTime: "22:00", preferred: true },
        saturday: { available: true, startTime: "12:00", endTime: "23:00", preferred: true },
        sunday: { available: true, startTime: "12:00", endTime: "22:00", preferred: true }
      },
      contactInfo: {
        email: "alan.james@restaurant.com",
        phone: "+1 (555) 345-6789",
        emergencyContact: "Lisa James (Sister) +1 (555) 345-6790"
      },
      startDate: "2023-06-10",
      status: "active"
    },
    {
      id: "S104",
      firstName: "Sarah",
      lastName: "Wilson",
      role: "Sous Chef",
      hourlyWage: 30,
      guaranteedHours: 40,
      stations: ["Hot Line", "Prep", "Expo"],
      employmentType: "full-time",
      performanceScore: 91,
      availability: {
        monday: { available: true, startTime: "08:00", endTime: "16:00", preferred: true },
        tuesday: { available: true, startTime: "08:00", endTime: "16:00", preferred: true },
        wednesday: { available: true, startTime: "08:00", endTime: "16:00", preferred: true },
        thursday: { available: true, startTime: "08:00", endTime: "16:00", preferred: true },
        friday: { available: true, startTime: "08:00", endTime: "16:00", preferred: true },
        saturday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false },
        sunday: { available: false, startTime: "09:00", endTime: "17:00", preferred: false }
      },
      contactInfo: {
        email: "sarah.wilson@restaurant.com",
        phone: "+1 (555) 456-7890",
        emergencyContact: "Tom Wilson (Partner) +1 (555) 456-7891"
      },
      startDate: "2022-11-05",
      status: "active"
    },
    {
      id: "S105",
      firstName: "Mike",
      lastName: "Rodriguez",
      role: "Line Cook",
      hourlyWage: 28,
      guaranteedHours: 35,
      stations: ["Hot Line", "Prep"],
      employmentType: "full-time",
      performanceScore: 85,
      availability: {
        monday: { available: true, startTime: "14:00", endTime: "22:00", preferred: true },
        tuesday: { available: true, startTime: "14:00", endTime: "22:00", preferred: true },
        wednesday: { available: true, startTime: "14:00", endTime: "22:00", preferred: true },
        thursday: { available: true, startTime: "14:00", endTime: "22:00", preferred: true },
        friday: { available: true, startTime: "14:00", endTime: "22:00", preferred: true },
        saturday: { available: true, startTime: "12:00", endTime: "23:00", preferred: true },
        sunday: { available: false, startTime: "12:00", endTime: "22:00", preferred: false }
      },
      contactInfo: {
        email: "mike.rodriguez@restaurant.com",
        phone: "+1 (555) 567-8901",
        emergencyContact: "Maria Rodriguez (Mother) +1 (555) 567-8902"
      },
      startDate: "2023-04-12",
      status: "active"
    }
  ];

  // Filter and sort staff data
  const filteredAndSortedStaff = useMemo(() => {
    const filtered = staffData.filter(staff => {
      const matchesSearch = 
        staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || staff.role === roleFilter;
      const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
      const matchesEmployment = employmentFilter === "all" || staff.employmentType === employmentFilter;
      
      return matchesSearch && matchesRole && matchesStatus && matchesEmployment;
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
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

    return filtered;
  }, [staffData, searchTerm, roleFilter, statusFilter, employmentFilter, sortBy, sortOrder]);

  const uniqueRoles = Array.from(new Set(staffData.map(staff => staff.role)));
  const uniqueStatuses = Array.from(new Set(staffData.map(staff => staff.status)));
  const uniqueEmploymentTypes = Array.from(new Set(staffData.map(staff => staff.employmentType)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'part-time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'casual': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  const handleSaveEdit = (updatedStaff: StaffMember) => {
    // In a real app, this would save to your backend
    console.log('Saving updated staff member:', updatedStaff);
    
    // Update the local data
    const updatedStaffData = staffData.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    );
    
    // For now, we'll just log the update
    // In a real app, you'd update your state or make an API call
    console.log('Staff data updated:', updatedStaffData);
    
    setShowEditModal(false);
    setEditingStaff(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingStaff(null);
  };

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
          <Link
            href="/onboarding"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add New Staff
          </Link>
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

      {/* Empty State */}
      {filteredAndSortedStaff.length === 0 && (
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
    </div>
  );
}
