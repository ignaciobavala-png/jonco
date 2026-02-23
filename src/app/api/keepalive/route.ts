import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { error } = await supabase
      .from("expediciones")
      .select("id")
      .limit(1);

    if (error) throw error;
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch (error) {
    console.error("Keepalive error:", error);
    return NextResponse.json({ ok: false, ts: Date.now() }, { status: 500 });
  }
}
