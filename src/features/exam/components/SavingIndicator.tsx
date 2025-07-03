import { CircleCheckBig } from "lucide-react";
import React from "react";

const SavingIndicator = ({ isSaving }: { isSaving: boolean }) => {
  return (
    <>
      {isSaving ? (
        <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-300">
          Menyimpan...
        </span>
      ) : (
        <span className="flex gap-2 rounded-full bg-green-100 px-4 py-2 text-green-600">
          Jawaban Tersimpan Otomatis <CircleCheckBig />
        </span>
      )}
    </>
  );
};

export default SavingIndicator;
