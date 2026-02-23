import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("configuracion")
      .select("*")
      .order("clave");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching configuracion:", error);
    return NextResponse.json({ error: "Failed to fetch configuracion" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { clave, valor } = await request.json();
    
    if (!clave || valor === undefined) {
      return NextResponse.json({ error: "clave and valor are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("configuracion")
      .upsert({ 
        clave, 
        valor, 
        updated_at: new Date().toISOString() 
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating configuracion:", error);
    return NextResponse.json({ error: "Failed to update configuracion" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clave, valor, descripcion } = await request.json();
    
    if (!clave || valor === undefined) {
      return NextResponse.json({ error: "clave and valor are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("configuracion")
      .insert({ 
        clave, 
        valor, 
        descripcion: descripcion || "" 
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating configuracion:", error);
    return NextResponse.json({ error: "Failed to create configuracion" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { clave } = await request.json();
    
    if (!clave) {
      return NextResponse.json({ error: "clave is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("configuracion")
      .delete()
      .eq("clave", clave);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting configuracion:", error);
    return NextResponse.json({ error: "Failed to delete configuracion" }, { status: 500 });
  }
}
