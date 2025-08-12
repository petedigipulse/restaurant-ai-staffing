import { NextResponse } from "next/server";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // In a real app, this would fetch data from your database
    // For now, we'll return mock data
    const staffData = [
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

    return NextResponse.json(staffData);
  } catch (error) {
    console.error('Error fetching staff data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff data' },
      { status: 500 }
    );
  }
}
