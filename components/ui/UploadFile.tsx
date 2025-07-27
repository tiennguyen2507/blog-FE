import React, { useRef, useState } from "react";
import Image from "next/image";

interface UploadFileProps {
  onChange?: (file: File) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (onChange) onChange(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      if (onChange) onChange(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-1">Upload a File</h2>
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition hover:border-blue-400 bg-gray-50 py-2 px-4 text-center w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="max-w-full object-contain rounded-3xl mb-2"
          />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mx-auto text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
              />
            </svg>
            <p className="text-gray-400">Click to upload or drag and drop</p>
          </>
        )}

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/svg+xml,image/png,image/jpeg,image/gif"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default UploadFile;
