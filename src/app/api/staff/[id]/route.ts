import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = params.id;
    const updateData = await request.json();

    console.log('🔄 Updating staff member:', staffId, 'with data:', updateData);

    // Update the staff member in the database
    const updatedStaff = await DatabaseService.updateStaffMember(staffId, updateData);

    if (!updatedStaff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    console.log('✅ Staff member updated successfully:', updatedStaff);

    return NextResponse.json({
      success: true,
      message: 'Staff member updated successfully',
      staff: updatedStaff
    });

  } catch (error: any) {
    console.error('❌ Error updating staff member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = params.id;

    console.log('🗑️ Deleting staff member:', staffId);

    // Delete the staff member from the database
    const success = await DatabaseService.deleteStaffMember(staffId);

    if (!success) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    console.log('✅ Staff member deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Error deleting staff member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}
