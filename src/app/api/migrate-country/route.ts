import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log("Attempting to add country column to testimonios table...");
    
    // Try to add the country column using direct SQL
    const { error } = await supabase
      .from('testimonios')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    // Test if country column exists by trying to update it
    const { error: updateError } = await supabase
      .from('testimonios')
      .update({ country: null })
      .eq('id', 1);

    if (updateError && updateError.message.includes('column') && updateError.message.includes('country')) {
      return NextResponse.json({ 
        success: false,
        error: "Country column doesn't exist in database",
        message: "Por favor, ejecuta este SQL manualmente en tu base de datos Supabase:",
        sql: "ALTER TABLE testimonios ADD COLUMN country VARCHAR(2);",
        instructions: [
          "1. Ve al panel de Supabase",
          "2. Navega a SQL Editor", 
          "3. Ejecuta: ALTER TABLE testimonios ADD COLUMN country VARCHAR(2);",
          "4. Vuelve a intentar guardar el testimonio con la bandera"
        ]
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Country column already exists in database" 
    });

  } catch (error) {
    console.error("Migration check error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Error checking database",
      message: "Por favor, ejecuta este SQL manualmente en tu base de datos Supabase:",
      sql: "ALTER TABLE testimonios ADD COLUMN country VARCHAR(2);",
      instructions: [
        "1. Ve al panel de Supabase",
        "2. Navega a SQL Editor", 
        "3. Ejecuta: ALTER TABLE testimonios ADD COLUMN country VARCHAR(2);",
        "4. Vuelve a intentar guardar el testimonio con la bandera"
      ]
    }, { status: 500 });
  }
}
