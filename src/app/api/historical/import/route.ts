import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

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
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream')) {
      return NextResponse.json({ error: 'Upload must be CSV with text/csv content-type' }, { status: 400 });
    }

    const organizationId = (await req.headers.get('x-organization-id')) || '';
    if (!organizationId) {
      return NextResponse.json({ error: 'Missing x-organization-id header' }, { status: 400 });
    }

    const text = await req.text();
    const rows = parseCSV(text);
    const normalized = rows.map((r) => ({
      date: r['Date'] || r['date'],
      time: r['Time'] || r['time'],
      totalSales: Number(r['Total Sales ($)'] || r['total_sales'] || 0),
      customerCount: Number(r['Customer Count'] || r['customer_count'] || 0),
      stationBreakdown: (() => {
        const raw = r['Station Breakdown'] || r['station_breakdown'] || '';
        if (!raw) return {} as Record<string, number>;
        const parts = String(raw).split(',').map((p: string) => p.trim());
        const acc: Record<string, number> = {};
        parts.forEach((p: string) => {
          const [k, v] = p.split(':').map((s: string) => s.trim());
          if (k) acc[k] = Number(v || 0);
        });
        return acc;
      })(),
      weatherConditions: r['Weather Conditions'] || r['weather_conditions'] || null,
      specialEvents: r['Special Events'] || r['special_events'] || null,
      notes: r['Notes'] || r['notes'] || null,
    }));

    const inserted = await DatabaseService.importHistoricalSales(organizationId, normalized);
    return NextResponse.json({ inserted: inserted?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to import CSV' }, { status: 500 });
  }
}


