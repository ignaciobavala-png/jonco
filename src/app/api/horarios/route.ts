import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('horarios')
      .select(`
        *,
        expediciones (title)
      `)
      .order('expedicion_id', { ascending: true });
    
    if (error) throw error;
    
    // Transform the data to match the original structure
    const transformedData = data.map(item => ({
      ...item,
      expedicion_title: item.expediciones?.title
    }));
    
    return NextResponse.json(transformedData);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching horarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expedicion_id, dias, hora_salida, hora_regreso, cupos } = body;
    
    const { data, error } = await supabase
      .from('horarios')
      .insert({
        expedicion_id,
        dias,
        hora_salida,
        hora_regreso,
        cupos: cupos ?? 6
      })
      .select(`
        *,
        expediciones (title)
      `)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the original structure
    const transformedData = {
      ...data,
      expedicion_title: data.expediciones?.title
    };
    
    return NextResponse.json(transformedData, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error creating horario" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, expedicion_id, dias, hora_salida, hora_regreso, cupos, activo } = body;
    
    const { data, error } = await supabase
      .from('horarios')
      .update({
        expedicion_id,
        dias,
        hora_salida,
        hora_regreso,
        cupos,
        activo: activo ?? 1
      })
      .eq('id', id)
      .select(`
        *,
        expediciones (title)
      `)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the original structure
    const transformedData = {
      ...data,
      expedicion_title: data.expediciones?.title
    };
    
    return NextResponse.json(transformedData);
  } catch (err) {
    return NextResponse.json({ error: "Error updating horario" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    const { error } = await supabase
      .from('horarios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error deleting horario" }, { status: 500 });
  }
}
