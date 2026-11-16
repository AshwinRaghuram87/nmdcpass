/**
 * Image compressor & file processor for document uploads
 * Automatically resizes & compresses high-resolution JPEGs (from phones, scanners, cameras)
 * into high-clarity, lightweight data URLs suitable for database storage and instant syncing.
 */

export interface ProcessedUploadFile {
  fileName: string;
  fileSize: string;
  fileUrl: string;
  fileType: string;
  isImage: boolean;
  dimensions?: { width: number; height: number };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function processUploadedFile(file: File): Promise<ProcessedUploadFile> {
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|bmp|gif)$/i.test(file.name);

  if (!isImage) {
    // For PDFs and documents, read as Data URL directly
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          fileName: file.name,
          fileSize: formatBytes(file.size),
          fileUrl: (e.target?.result as string) || '',
          fileType: file.type || 'application/pdf',
          isImage: false,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read document file'));
      reader.readAsDataURL(file);
    });
  }

  // For JPEG and image files: resize and optimize via HTML5 Canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = (e.target?.result as string) || '';
      const img = new Image();

      img.onload = () => {
        const maxWidth = 1800;
        const maxHeight = 1800;
        let { width, height } = img;

        // Downscale while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          resolve({
            fileName: file.name,
            fileSize: formatBytes(file.size),
            fileUrl: rawDataUrl,
            fileType: file.type || 'image/jpeg',
            isImage: true,
          });
          return;
        }

        // Fill background white in case of transparent PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality JPEG
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
        
        // Calculate size in bytes of the base64 string
        const base64Length = optimizedDataUrl.length - (optimizedDataUrl.indexOf(',') + 1);
        const approxBytes = Math.round((base64Length * 3) / 4);

        resolve({
          fileName: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
          fileSize: formatBytes(approxBytes),
          fileUrl: optimizedDataUrl,
          fileType: 'image/jpeg',
          isImage: true,
          dimensions: { width, height },
        });
      };

      img.onerror = () => {
        // Fallback if image decode fails
        resolve({
          fileName: file.name,
          fileSize: formatBytes(file.size),
          fileUrl: rawDataUrl,
          fileType: file.type || 'image/jpeg',
          isImage: true,
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
