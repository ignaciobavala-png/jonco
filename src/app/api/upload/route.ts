import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'jonco-photos';

// Este endpoint solo genera una URL firmada de Supabase.
// El archivo lo sube el cliente DIRECTAMENTE a Supabase (no pasa por Next.js).
// Esto evita el límite de body size de Next.js (413).
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { folder, filename, contentType } = await request.json();

    if (!folder || !filename || !contentType) {
      return NextResponse.json(
        { error: 'folder, filename y contentType son requeridos' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_\-\/]+$/.test(folder)) {
      return NextResponse.json({ error: 'Nombre de carpeta inválido' }, { status: 400 });
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    ];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }

    const timestamp = Date.now();
    const baseName = filename.split('.')[0].replace(/[^a-zA-Z0-9_\-]/g, '_');
    const ext = filename.includes('.') ? filename.split('.').pop() : contentType.split('/')[1];
    const isVideo = contentType.startsWith('video/');
    const path = isVideo
      ? `${folder}/videos/${baseName}-${timestamp}.${ext}`
      : `${folder}/images/${baseName}-${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path, { upsert: true });

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? 'No se pudo crear la URL firmada' },
        { status: 500 }
      );
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;

    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
