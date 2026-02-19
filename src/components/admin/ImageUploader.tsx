'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder: string;
  className?: string;
  accept?: string;
}

export default function ImageUploader({ 
  onUpload, 
  currentImage, 
  folder, 
  className = '',
  accept = 'image/*,video/*'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const allowedTypes = [
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
    "video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"
  ];
  const maxSize = 50 * 1024 * 1024; // 50MB for videos

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => allowedTypes.includes(file.type));
    
    if (validFile) {
      if (validFile.size > maxSize) {
        setError('File size must be less than 50MB');
        return;
      }
      handleUpload(validFile);
    } else {
      setError('Please upload an image or video file');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && allowedTypes.includes(file.type)) {
      if (file.size > maxSize) {
        setError('File size must be less than 50MB');
        return;
      }
      handleUpload(file);
    } else {
      setError('Please select an image or video file');
    }
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setPreview(response.url);
            onUpload(response.url);
            setUploadProgress(100);
          } else {
            setError(response.error || 'Upload failed');
          }
        } else {
          setError('Upload failed');
        }
        setIsUploading(false);
      });

      // Handle error
      xhr.addEventListener('error', () => {
        setError('Upload failed');
        setIsUploading(false);
      });

      // Send request
      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (err) {
      setError('Upload failed');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    setError(null);
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative group">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
            {preview.includes('video') || preview.endsWith('.mp4') || preview.endsWith('.mov') || preview.endsWith('.webm') ? (
              <video
                src={preview}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <>
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Drop image or video here or click to browse</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, MOV, WebM up to 50MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
