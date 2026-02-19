import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('expediciones')
      .select('*')
      .eq('activo', 1)
      .order('id', { ascending: true });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching expediciones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, description, price, image, gallery } = body;
    
    const { data, error } = await supabase
      .from('expediciones')
      .insert({
        title,
        category,
        description,
        price: price ?? null,
        image,
        gallery: gallery ?? ""
      })
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error creating expedicion" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, category, description, price, image, gallery, activo } = body;
    
    const { data, error } = await supabase
      .from('expediciones')
      .update({
        title,
        category,
        description,
        price: price ?? null,
        image,
        gallery: gallery ?? "",
        activo: activo ?? 1
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error updating expedicion" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    const { error } = await supabase
      .from('expediciones')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error deleting expedicion" }, { status: 500 });
  }
}
