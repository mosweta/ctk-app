// src/lib/downscaleImage.js
/**
 * Downscale an image File before upload if it exceeds maxDimension on
 * either edge. Preserves the extension for JPEG/WebP inputs; PNGs are
 * re-encoded as PNG to preserve transparency.
 *
 * Returns the original File if:
 *   - it's already under maxDimension on both edges, or
 *   - createImageBitmap / canvas.toBlob fails.
 *
 * Never throws — always returns a File.
 */
export async function downscaleImage(file, maxDimension = 1920, quality = 0.85) {
  if (typeof createImageBitmap !== 'function') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const tooWide = bitmap.width > maxDimension;
    const tooTall = bitmap.height > maxDimension;
    if (!tooWide && !tooTall) {
      bitmap.close?.();
      return file;
    }
    const scale = maxDimension / Math.max(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise((resolve) =>
      canvas.toBlob(
        resolve,
        outType,
        outType === 'image/png' ? undefined : quality
      )
    );
    if (!blob) return file;
    const ext = outType === 'image/png' ? 'png' : 'jpg';
    return new File([blob], file.name.replace(/\.\w+$/, `.${ext}`), {
      type: outType,
    });
  } catch (err) {
    console.warn('Image downscale failed, using original:', err);
    return file;
  }
}