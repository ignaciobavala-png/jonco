import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("testimonios")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching testimonios:", error);
    return NextResponse.json({ error: "Failed to fetch testimonios" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, location, experience, date, text } = await request.json();

    if (!name || !text) {
      return NextResponse.json({ error: "name and text are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testimonios")
      .insert({ name, location, experience, date, text, activo: true })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating testimonio:", error);
    return NextResponse.json({ error: "Failed to create testimonio" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("testimonios")
      .update({ activo: false })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonio:", error);
    return NextResponse.json({ error: "Failed to delete testimonio" }, { status: 500 });
  }
}
