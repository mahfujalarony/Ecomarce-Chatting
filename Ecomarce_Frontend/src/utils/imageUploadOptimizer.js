const DEFAULTS = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  outputType: "image/webp",
  maxBytes: 900 * 1024,
  minQuality: 0.6,
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert optimized image"));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });

const getResizedDimensions = (width, height, maxWidth, maxHeight) => {
  if (!width || !height) return { width: maxWidth, height: maxHeight };
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
};

export const formatBytes = (bytes) => {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export const optimizeImageFile = async (file, options = {}) => {
  const settings = { ...DEFAULTS, ...options };
  if (!(file instanceof File) || !String(file.type || "").startsWith("image/")) return file;

  const sourceUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceUrl);
  const { width, height } = getResizedDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    settings.maxWidth,
    settings.maxHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return file;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  let quality = settings.quality;
  let blob = await canvasToBlob(canvas, settings.outputType, quality);

  while (blob.size > settings.maxBytes && quality > settings.minQuality) {
    quality = Math.max(settings.minQuality, Number((quality - 0.06).toFixed(2)));
    blob = await canvasToBlob(canvas, settings.outputType, quality);
    if (quality <= settings.minQuality) break;
  }

  if (blob.size >= file.size && width >= (image.naturalWidth || image.width) && height >= (image.naturalHeight || image.height)) {
    return file;
  }

  const nextName = String(file.name || "image")
    .replace(/\.[^.]+$/, "")
    .concat(".webp");

  return new File([blob], nextName, {
    type: settings.outputType,
    lastModified: Date.now(),
  });
};

export const optimizeImageFiles = async (files, options = {}) => {
  const list = Array.from(files || []);
  return Promise.all(list.map((file) => optimizeImageFile(file, options)));
};
