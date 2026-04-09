import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("configuracion")
      .select("*")
      .order("clave");

    if (error) throw error;

    // Get locale from query param or default to 'es'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';

    // Keys that are multilingual
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

    // Process data to extract correct language from JSON
    const processedData = (data || []).map(item => {
      if (multilingualKeys.includes(item.clave)) {
        try {
          const jsonValue = JSON.parse(item.valor);
          return {
            ...item,
            valor: jsonValue[locale] || jsonValue['es'] || item.valor
          };
        } catch {
          // Fallback if not valid JSON
          return item;
        }
      }
      return item;
    });

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching configuracion:", error);
    return NextResponse.json({ error: "Failed to fetch configuracion" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { clave, valor, locale = 'es' } = await request.json();
    
    if (!clave || valor === undefined) {
      return NextResponse.json({ error: "clave and valor are required" }, { status: 400 });
    }

    // Keys that are multilingual
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

    let finalValue = valor;

    // If it's a multilingual key, handle JSON structure
    if (multilingualKeys.includes(clave)) {
      // Get existing value to preserve other languages
      const { data: existing } = await supabase
        .from("configuracion")
        .select("valor")
        .eq("clave", clave)
        .single();

      let jsonValue = { es: "", en: "", it: "" };
      
      if (existing?.valor) {
        try {
          jsonValue = JSON.parse(existing.valor);
        } catch {
          // If parsing fails, start fresh
          jsonValue = { es: "", en: "", it: "" };
        }
      }

      // Update only the specified locale
      jsonValue[locale] = valor;
      finalValue = JSON.stringify(jsonValue);
    }

    const { data, error } = await supabase
      .from("configuracion")
      .upsert({ 
        clave, 
        valor: finalValue, 
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
