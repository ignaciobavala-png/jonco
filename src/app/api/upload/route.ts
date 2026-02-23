import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { error: 'No folder provided' },
        { status: 400 }
      );
    }

    // Validate folder name to prevent directory traversal
    if (!/^[a-zA-Z0-9_\-\/]+$/.test(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Extended allowed file types including videos
    const allowedTypes = [
      "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
      "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Increased max file size for videos (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB para videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.split('.')[0].replace(/[^a-zA-Z0-9_\-]/g, '_');
    const fileExtension = file.type.split('/')[1];
    
    const isVideo = file.type.startsWith("video/");

    if (isVideo) {
      const videoFilename = `${originalName}-${timestamp}.${fileExtension}`;
      const videoPath = `${folder}/videos/${videoFilename}`;

      const { error: videoError } = await supabase.storage
        .from("jonco-photos")
        .upload(videoPath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (videoError) {
        console.error('Video upload error:', videoError);
        return NextResponse.json(
          { error: 'Failed to upload video' },
          { status: 500 }
        );
      }

      const { data: videoUrlData } = supabase.storage
        .from("jonco-photos")
        .getPublicUrl(videoPath);

      return NextResponse.json({ success: true, url: videoUrlData.publicUrl });

    } else {
      // Handle image processing (existing logic)
      const processedBuffer = await sharp(buffer)
        .webp({ quality: 82, effort: 4 })
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
      
      // Upload processed image to Supabase
      const filename = `${originalName}-${timestamp}.webp`;
      const imagePath = `${folder}/images/${filename}`;
      
      const { error: uploadError } = await supabase.storage
        .from("jonco-photos")
        .upload(imagePath, processedBuffer, {
          contentType: "image/webp",
          cacheControl: "3600",
        });
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("jonco-photos")
        .getPublicUrl(imagePath);
      
      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        type: 'image'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
