import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contacto')
      .select('*');
    
    if (error) throw error;
    
    // Transform the data to match the original structure (key-value pairs)
    const contacto: Record<string, string> = {};
    data.forEach((row: { clave: string; valor: string }) => {
      contacto[row.clave] = row.valor;
    });
    
    return NextResponse.json(contacto);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching contacto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const entries = Object.entries(body) as [string, string][];
    
    // Use upsert to handle both insert and update operations
    const upsertData = entries.map(([clave, valor]) => ({ clave, valor }));
    
    const { error } = await supabase
      .from('contacto')
      .upsert(upsertData, { onConflict: 'clave' });
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error updating contacto" }, { status: 500 });
  }
}
