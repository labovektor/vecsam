export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      return resolve(result.substring(result.indexOf(",") + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // otomatis output dalam format base64
  });
};

export const csvToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type !== "text/csv") {
      reject(new Error("File bukan CSV"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file); // ini penting untuk CSV
  });
};
