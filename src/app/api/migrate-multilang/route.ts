import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Get all current configuration
    const { data: config, error } = await supabase
      .from("configuracion")
      .select("*");

    if (error) throw error;

    // Keys that should be multilingual
    const multilingualKeys = [
      "hero_label",
      "hero_titulo", 
      "hero_titulo_accent",
      "hero_subtitulo",
      "historia_cita",
      "historia_parrafo_1",
      "historia_parrafo_2", 
      "historia_firma",
      "footer_tagline",
      "footer_location",
      "footer_coordinates"
    ];

    for (const item of config || []) {
      if (multilingualKeys.includes(item.clave)) {
        // Convert existing value to JSON format
        // Assume existing content is English, move it to "en" key
        const jsonValue = {
          es: item.valor, // Spanish as default (copy current)
          en: item.valor, // English (copy current)
          it: item.valor  // Italian (copy current)
        };

        // Update with JSON value
        const { error: updateError } = await supabase
          .from("configuracion")
          .update({ 
            valor: JSON.stringify(jsonValue),
            updated_at: new Date().toISOString()
          })
          .eq("clave", item.clave);

        if (updateError) throw updateError;
        
        console.log(`Migrated ${item.clave} to JSON format`);
      }
    }

    return NextResponse.json({ 
      message: "Migration completed successfully",
      migrated: multilingualKeys.length 
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
