'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
}

interface MediaUploadProps {
  eventId: string;
  apiBaseUrl: string;
  title: string;
  description: string;
}

export function MediaUpload({ eventId, apiBaseUrl, title, description }: MediaUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<MediaFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        urls.push(URL.createObjectURL(file));
      }
    });
    setPreviewUrls(urls);

    // Cleanup
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}?eventId=${eventId}`);
        if (!res.ok) throw new Error('Failed to load gallery');
        const data = await res.json();
        setGallery(data.files || []);
      } catch (error) {
        console.error('Gallery fetch error:', error);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, [apiBaseUrl, eventId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('file', file);
    });
    formData.append('eventId', eventId);

    try {
      const res = await fetch(apiBaseUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.errors && data.errors.length > 0) {
        setMessage({ 
          type: 'success', // Still success but with warnings
          text: `Uploaded ${data.files.length} files. ${data.errors.length} failed.` 
        });
      } else {
        setMessage({ type: 'success', text: 'Upload successful! Thanks for sharing.' });
      }
      
      setFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh gallery after short delay to allow Drive to process
      // We need to re-fetch, but fetchGallery is inside useEffect. 
      // We can trigger a re-fetch by toggling a dependency or moving fetchGallery out with useCallback.
      // For simplicity in this fix, I'll just duplicate the fetch logic or use a trigger.
      setTimeout(async () => {
         try {
            const res = await fetch(`${apiBaseUrl}?eventId=${eventId}`);
            if (res.ok) {
              const data = await res.json();
              setGallery(data.files || []);
            }
          } catch (e) { console.error(e); }
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-16 container mx-auto px-4" id="media-upload">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-semibold mb-2">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Upload Section */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mb-12 border border-purple-100">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-xl p-8 bg-purple-50/30 hover:bg-purple-50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/mp4,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-3 w-full"
          >
            {previewUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 w-full mb-2">
                {previewUrls.slice(0, 6).map((url, idx) => (
                  <div key={idx} className="relative w-full h-24">
                    <Image 
                      src={url} 
                      alt={`Preview ${idx}`} 
                      fill 
                      className="object-cover rounded-lg" 
                    />
                  </div>
                ))}
                {previewUrls.length > 6 && (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg h-24 text-gray-500 text-sm font-medium">
                    +{previewUrls.length - 6} more
                  </div>
                )}
              </div>
            ) : (
              <Upload className="w-10 h-10 text-purple-500" />
            )}
            <span className="text-gray-600 font-medium">
              {files && files.length > 0 
                ? `${files.length} file${files.length > 1 ? 's' : ''} selected` 
                : 'Click to select photos or videos'}
            </span>
            <span className="text-xs text-gray-400">Max 10MB each • JPG, PNG, MP4</span>
          </label>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!files || uploading}
          className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            !files || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            'Upload Media'
          )}
        </button>
      </div>

      {/* Gallery Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-serif font-semibold text-center mb-8 text-gray-800">Shared Moments</h3>
        
        {loadingGallery ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-2xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No photos yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <a
                key={item.id}
                href={item.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {item.thumbnailLink ? (
                  <Image
                    src={item.thumbnailLink.replace('=s220', '=s600')} // Request larger thumbnail
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
