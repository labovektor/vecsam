import { z } from "zod";

export const fileToBase64Zod = ({ type }: { type: "image" | "pdf" | "csv" }) =>
  z
    .instanceof(File)
    .refine((file) => {
      if (type === "image") return file.type.startsWith("image/");
      if (type === "pdf") return file.type.startsWith("application/pdf");
      if (type === "csv") return file.type.startsWith("text/csv");
      return false;
    })
    .refine((file) => {
      return !file || !file.size || file.size < 1024 * 1024 * 5;
    }, "File size must be less than 5MB")
    .transform(async (file) => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return base64;
    });
