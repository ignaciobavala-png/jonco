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
    const { name, location, experience, date, country, text } = await request.json();

    if (!name || !text) {
      return NextResponse.json({ error: "name and text are required" }, { status: 400 });
    }

    console.log("Creating testimonio:", { name, location, experience, date, country, text });

    // First try to insert with all fields including country
    let insertData: any = { name, location, experience, date, country, text, activo: true };

    let { data, error } = await supabase
      .from("testimonios")
      .insert(insertData)
      .select()
      .single();

    // If the error is about missing 'country' column, try to add it first
    if (error && error.message && error.message.includes('column') && error.message.includes('country')) {
      console.log("Country column doesn't exist, attempting to add it");
      
      // Try to add the country column
      try {
        const { error: alterError } = await supabase
          .rpc('exec', { sql: 'ALTER TABLE testimonios ADD COLUMN country VARCHAR(2)' });
        
        if (alterError) {
          console.log("Could not add column automatically, proceeding without country");
        } else {
          console.log("Country column added successfully, retrying insert");
          // Retry the insert now that the column exists
          const result = await supabase
            .from("testimonios")
            .insert(insertData)
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        }
      } catch (e) {
        console.log("Could not add column automatically, proceeding without country");
      }

      // If still failing, insert without country
      if (error) {
        console.log("Proceeding without country field");
        insertData = { name, location, experience, date, text, activo: true };

        const result = await supabase
          .from("testimonios")
          .insert(insertData)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }
    }

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Created testimonio successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating testimonio:", error);
    return NextResponse.json({ error: "Failed to create testimonio", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { name, location, experience, date, country, text } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (!name || !text) {
      return NextResponse.json({ error: "name and text are required" }, { status: 400 });
    }

    console.log("Updating testimonio:", { id, name, location, experience, date, country, text });

    // First try to update with all fields including country
    let updateData: any = { name, location, experience, date, country, text };
    
    try {
      updateData.updated_at = new Date().toISOString();
    } catch (e) {
      // If timestamp creation fails, continue without it
    }

    let { data, error } = await supabase
      .from("testimonios")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    // If the error is about missing 'country' column, try without it
    if (error && error.message && error.message.includes('column') && error.message.includes('country')) {
      console.log("Country column doesn't exist, trying without it");
      updateData = { name, location, experience, date, text };
      try {
        updateData.updated_at = new Date().toISOString();
      } catch (e) {
        // If timestamp creation fails, continue without it
      }

      const result = await supabase
        .from("testimonios")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Updated testimonio successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating testimonio:", error);
    return NextResponse.json({ error: "Failed to update testimonio", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
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
