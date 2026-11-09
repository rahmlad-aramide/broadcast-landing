// In-browser image compression for WhatsApp. Nothing is uploaded anywhere.
//
// How it helps: when you send a "photo", WhatsApp downscales it (standard quality: longest side
// ~1280-1600 px; HD: roughly 2048-3120 px depending on the device), re-encodes it as a lossy
// JPEG/WebP at about 70-80% quality with 4:2:0 chroma subsampling, and strips metadata. An image
// that is already about that size and weight gets recompressed far less, so less extra quality is
// lost. It can't be guaranteed or switched off, and every further edit/re-save of the compressed
// file adds another round of loss — for zero recompression, send the original as a Document.

export interface Preset {
    id: 'chat' | 'sharp' | 'api' | 'custom';
    label: string;
    description: string;
    maxDimension: number;
    quality: number; // 0..1
    maxBytes?: number; // when set, quality/size are reduced until the file fits
}

export const PRESETS: Preset[] = [
    { id: 'chat', label: 'WhatsApp chat (recommended)', description: 'About 1600 px on the longest side, the top of what WhatsApp uses for standard-quality photos (roughly 1280–1600 px), so it has little left to degrade.', maxDimension: 1600, quality: 0.88 },
    { id: 'sharp', label: 'Sharper', description: 'Up to 2560 px at higher quality, for when you send as HD (which allows roughly 2048–3120 px depending on the phone). Larger files; WhatsApp may still recompress.', maxDimension: 2560, quality: 0.92 },
    { id: 'api', label: 'WhatsApp API (under 5 MB)', description: "For template header images sent through Broadcast / the WhatsApp Cloud API, which accepts images up to 5 MB.", maxDimension: 2048, quality: 0.9, maxBytes: 5 * 1024 * 1024 },
    { id: 'custom', label: 'Custom', description: 'Choose your own size and quality.', maxDimension: 1600, quality: 0.85 },
];

export interface CompressResult {
    blob: Blob;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/avif'];

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode the image'))), 'image/jpeg', quality),
    );
}

function draw(bitmap: ImageBitmap, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser');
    ctx.fillStyle = '#ffffff'; // JPEG has no transparency: flatten PNG/WebP transparency onto white
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas;
}

export async function compressImage(file: File, opts: { maxDimension: number; quality: number; maxBytes?: number }): Promise<CompressResult> {
    // 'from-image' applies the EXIF rotation, so phone photos don't come out sideways.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const originalWidth = bitmap.width;
    const originalHeight = bitmap.height;
    try {
        let max = Math.min(opts.maxDimension, Math.max(originalWidth, originalHeight));
        const quality = opts.quality;
        for (let attempt = 0; attempt < 6; attempt++) {
            const scale = max / Math.max(originalWidth, originalHeight);
            const w = Math.max(1, Math.round(originalWidth * Math.min(1, scale)));
            const h = Math.max(1, Math.round(originalHeight * Math.min(1, scale)));
            const canvas = draw(bitmap, w, h);
            let blob = await toBlob(canvas, quality);
            if (opts.maxBytes && blob.size > opts.maxBytes) {
                // Step quality down first, then shrink the dimensions and try again.
                for (let q = quality - 0.07; q >= 0.5 && blob.size > opts.maxBytes; q -= 0.07) blob = await toBlob(canvas, q);
                if (blob.size > opts.maxBytes) { max = Math.round(max * 0.85); continue; }
            }
            return { blob, width: w, height: h, originalWidth, originalHeight };
        }
        throw new Error('Could not get this image under the size limit');
    } finally {
        bitmap.close();
    }
}

export function formatBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function outputName(original: string): string {
    return original.replace(/\.[^.]+$/, '') + '-by-broadcast.jpg';
}
