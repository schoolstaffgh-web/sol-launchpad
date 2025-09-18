"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function TokenCreatorPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-teal-400 mb-6">Token Creator</h1>

        <form className="grid grid-cols-1 gap-6">
          {/* TOKEN NAME */}
          <input
            type="text"
            placeholder="Token Name"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* TOKEN SYMBOL */}
          <input
            type="text"
            placeholder="Token Symbol"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* DECIMALS */}
          <input
            type="number"
            placeholder="Put the decimals of your token"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* WEBSITE */}
          <input
            type="url"
            placeholder="Website"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* TWITTER */}
          <input
            type="url"
            placeholder="Twitter"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* TELEGRAM */}
          <input
            type="url"
            placeholder="Telegram"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* DISCORD */}
          <input
            type="url"
            placeholder="Discord"
            className="p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* UPLOAD IMAGE */}
          <div className="col-span-2">
            {/* hidden input */}
            <input
              id="token-image-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* visible upload box */}
            <div
              className="border-2 border-dashed border-teal-400/50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/30 transition"
              onClick={() =>
                document.getElementById("token-image-input")?.click()
              }
            >
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded mb-2"
                />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-teal-400 mb-2" />
                  <p className="text-sm text-slate-300">Upload Image</p>
                </>
              )}
            </div>

            {/* filename */}
            {imageFile && (
              <p className="mt-2 text-sm text-slate-300 text-center">
                {imageFile.name} uploaded ✅
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Create Token
          </button>
        </form>
      </div>
    </main>
  );
}
