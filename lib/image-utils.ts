export async function compressImage(file: File, options?: { maxWidth: number; quality: number; maxOutputSizeKB?: number }): Promise<string> {
  const { maxWidth = 1024, quality = 0.7, maxOutputSizeKB = 300 } = options || {};

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try to compress to fit within maxOutputSizeKB
        let currentQuality = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);

        // Simple loop to reduce quality if size is too large
        while (dataUrl.length > maxOutputSizeKB * 1024 && currentQuality > 0.1) {
            currentQuality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
        }

        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
