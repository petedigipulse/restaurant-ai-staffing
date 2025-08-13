import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/database";
import crypto from "crypto";

export const dynamic = 'force-dynamic';
export const revalidate = false;

function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let c = 0; c < raw.length; c++) {
      const ch = raw[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current);
    
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] || '').trim().replace(/^"|"$/g, '');
    });
    rows.push(obj);
  }
  
  return rows;
}

export async function POST(req: Request) {
  try {
    console.log('Staff import API called');
    
    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    if (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream')) {
      return NextResponse.json({ 
        error: "Upload must be CSV with text/csv content-type" 
      }, { status: 400 });
    }

    const organizationId = req.headers.get('x-organization-id') || '';
    console.log('Organization ID:', organizationId);
    
    if (!organizationId) {
      return NextResponse.json({ 
        error: "Missing x-organization-id header" 
      }, { status: 400 });
    }

    const text = await req.text();
    console.log('CSV text received, length:', text.length);
    console.log('CSV preview:', text.substring(0, 300));
    
    const rows = parseCSV(text);
    console.log('Parsed CSV rows:', rows.length);
    console.log('First row sample:', rows[0]);
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        error: "No data found in CSV" 
      }, { status: 400 });
    }

    // First, ensure the organization exists
    console.log('Ensuring organization exists before importing staff...');
    const organization = await DatabaseService.createOrganization({
      id: organizationId,
      name: 'Restaurant Organization',
      type: 'restaurant',
      timezone: 'UTC',
      operating_hours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      owner_id: crypto.randomUUID()
    });
    console.log('Organization created/verified:', organization);

    // Now import staff
    console.log('Calling DatabaseService.importStaffFromCSV with:', { organizationId, rowsCount: rows.length });
    const importedStaff = await DatabaseService.importStaffFromCSV(organizationId, rows);
    console.log('Import result:', importedStaff);

    return NextResponse.json({ 
      success: true,
      imported: importedStaff?.length || 0,
      message: `Successfully imported ${importedStaff?.length || 0} staff members`
    });
    
  } catch (err: any) {
    console.error('Staff import error:', err);
    return NextResponse.json({ 
      error: err?.message || 'Failed to import staff CSV' 
    }, { status: 500 });
  }
}
