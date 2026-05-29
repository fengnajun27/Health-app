/** 无照片时头像文字：显示「名」不显示「姓」 */
export function getGivenNameLabel(fullName: string): string {
  const name = fullName.trim();
  if (!name) return "?";
  if (name.length === 1) return name;
  if (name.length === 2) return name.charAt(1);
  return name.slice(1);
}

const MAX_AVATAR_BYTES = 400_000;
const AVATAR_SIZE = 256;

export async function compressAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("图片不能超过 8MB");
  }

  const dataUrl = await readAsDataUrl(file);
  const compressed = await resizeToDataUrl(dataUrl);

  const approxBytes = Math.ceil((compressed.length * 3) / 4);
  if (approxBytes > MAX_AVATAR_BYTES) {
    throw new Error("图片过大，请换一张更小的照片");
  }

  return compressed;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}

function resizeToDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        1,
        AVATAR_SIZE / img.width,
        AVATAR_SIZE / img.height
      );
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("无法处理图片"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("无法加载图片"));
    img.src = dataUrl;
  });
}
