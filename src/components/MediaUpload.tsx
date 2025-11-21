'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, X, ChevronLeft, ChevronRight, Download, Play, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('media');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<MediaFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<'order' | 'random'>('order');
  const [lastViewedIndex, setLastViewedIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const resizeImage = (file: File, maxSizeInMB: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate scale to reduce file size
          const maxDimension = 1920; // Max width or height
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Start with quality 0.9 and reduce if needed
          let quality = 0.9;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }
                
                const maxSize = maxSizeInMB * 1024 * 1024;
                if (blob.size <= maxSize || quality <= 0.1) {
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  quality -= 0.1;
                  tryCompress();
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          tryCompress();
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    
    try {
      // Process each file
      const processedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          // Only resize images, not videos
          if (file.type.startsWith('image/')) {
            const maxSize = 1; // 1MB
            const sizeInMB = file.size / (1024 * 1024);
            
            if (sizeInMB > maxSize) {
              return await resizeImage(file, maxSize);
            }
          }
          return file;
        })
      );
      
      processedFiles.forEach(file => {
        formData.append('file', file);
      });
    } catch (err) {
      console.error('Image processing error:', err);
      setMessage({ type: 'error', text: 'Failed to process images' });
      setUploading(false);
      return;
    }
    
    formData.append('eventId', eventId);

    try {
      const res = await fetch(apiBaseUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('upload.uploadFailed'));
      }

      if (data.errors && data.errors.length > 0) {
        setMessage({ 
          type: 'success', // Still success but with warnings
          text: t('upload.uploadPartial', { uploaded: data.files.length, failed: data.errors.length })
        });
      } else {
        setMessage({ type: 'success', text: t('upload.uploadSuccess') });
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
      const errorMessage = error instanceof Error ? error.message : t('upload.errorGeneric');
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const handlePrevious = () => {
    if (!selectedMedia) return;
    const currentIndex = gallery.findIndex(item => item.id === selectedMedia.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
    setSelectedMedia(gallery[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedMedia) return;
    const currentIndex = gallery.findIndex(item => item.id === selectedMedia.id);
    const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
    setSelectedMedia(gallery[nextIndex]);
  };

  const handleDownload = async () => {
    if (!selectedMedia) return;
    
    try {
      // Use the API route to download the file
      const response = await fetch(`${apiBaseUrl}/download?fileId=${selectedMedia.id}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedMedia.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(selectedMedia.webViewLink, '_blank');
    }
  };

  const getNextMedia = useCallback((currentMedia: MediaFile | null): MediaFile | null => {
    if (!currentMedia || gallery.length === 0) return null;
    
    const currentIndex = gallery.findIndex(item => item.id === currentMedia.id);
    
    if (playMode === 'random') {
      // Get random index different from current
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * gallery.length);
      } while (randomIndex === currentIndex && gallery.length > 1);
      return gallery[randomIndex];
    } else {
      // Sequential order
      const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
      return gallery[nextIndex];
    }
  }, [gallery, playMode]);

  const toggleAutoPlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVideoEnded = () => {
    if (isPlaying) {
      // Automatically move to next media when video ends
      setSelectedMedia(currentMedia => getNextMedia(currentMedia));
    }
  };

  // Handle autoplay with proper dependencies
  useEffect(() => {
    if (isPlaying && selectedMedia && !selectedMedia.mimeType.startsWith('video/')) {
      // Only use interval for images, videos handle their own timing
      const interval = setInterval(() => {
        setSelectedMedia(currentMedia => getNextMedia(currentMedia));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, gallery, selectedMedia, getNextMedia]);

  // Track last viewed index for resuming playback
  useEffect(() => {
    if (selectedMedia) {
      const currentIndex = gallery.findIndex(item => item.id === selectedMedia.id);
      if (currentIndex !== -1) {
        setLastViewedIndex(currentIndex);
      }
    }
  }, [selectedMedia, gallery]);

  // Cleanup autoplay on unmount or when overlay closes
  useEffect(() => {
    if (!selectedMedia) {
      setIsPlaying(false);
    }
  }, [selectedMedia]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      } else if (e.key === 'ArrowLeft') {
        // Previous
        setSelectedMedia(currentMedia => {
          if (!currentMedia) return null;
          const currentIndex = gallery.findIndex(item => item.id === currentMedia.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
          return gallery[prevIndex];
        });
      } else if (e.key === 'ArrowRight') {
        // Next
        setSelectedMedia(currentMedia => {
          if (!currentMedia) return null;
          const currentIndex = gallery.findIndex(item => item.id === currentMedia.id);
          const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
          return gallery[nextIndex];
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, gallery]);

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
                    +{previewUrls.length - 6} {t('upload.moreFiles')}
                  </div>
                )}
              </div>
            ) : (
              <Upload className="w-10 h-10 text-purple-500" />
            )}
            <span className="text-gray-600 font-medium">
              {files && files.length > 0 
                ? `${files.length} ${files.length > 1 ? t('upload.filesSelectedPlural') : t('upload.filesSelected')} ${t('upload.selected')}` 
                : t('upload.selectFiles')}
            </span>
            <span className="text-xs text-gray-400">{t('upload.maxSize')}</span>
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
              {t('upload.uploading')}
            </>
          ) : (
            t('upload.uploadButton')
          )}
        </button>
      </div>

      {/* Gallery Section */}
      <div className="mt-16">
        {gallery.length > 0 && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                setPlayMode('order');
                if (gallery.length > 0) {
                  // If not in order mode or at the end, start from beginning
                  // Otherwise resume from last viewed position
                  const startIndex = playMode !== 'order' || lastViewedIndex >= gallery.length - 1 ? 0 : lastViewedIndex;
                  setSelectedMedia(gallery[startIndex]);
                  setIsPlaying(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                playMode === 'order'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('gallery.playInOrder')}
            </button>
            <button
              onClick={() => {
                setPlayMode('random');
                if (gallery.length > 0) {
                  const randomIndex = Math.floor(Math.random() * gallery.length);
                  setSelectedMedia(gallery[randomIndex]);
                  setIsPlaying(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                playMode === 'random'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('gallery.playRandom')}
            </button>
          </div>
        )}
        
        {loadingGallery ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-2xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('gallery.noPhotos')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {item.thumbnailLink ? (
                  <Image
                    src={item.thumbnailLink.replace('=s220', '=s600')}
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
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media Overlay */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="absolute bottom-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
            aria-label="Download"
          >
            <Download size={24} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAutoPlay();
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-4 hover:bg-black/70"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
          
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.mimeType.startsWith('video/') ? (
              <video
                ref={videoRef}
                src={`${apiBaseUrl}/download?fileId=${selectedMedia.id}`}
                controls
                autoPlay
                onEnded={handleVideoEnded}
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={selectedMedia.thumbnailLink?.replace('=s220', '=s2000') || selectedMedia.webViewLink || ''}
                  alt={selectedMedia.name}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
