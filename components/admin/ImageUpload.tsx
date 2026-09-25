"use client";

import { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
// Optional: folder in your Cloudinary Media Library (the upload preset can also set it)
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

/** Uploads a photo to Cloudinary and gives back its link. */
export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    if (!CLOUD || !PRESET) {
      setError("Cloudinary is not set up yet (see README).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", PRESET);
      if (FOLDER) body.append("folder", FOLDER);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
        { method: "POST", body }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
      onChange(json.secure_url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-40 w-40 rounded-xl border border-line object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-600 text-white"
            aria-label="Remove photo"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <label
          className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-sm text-muted transition hover:border-accent hover:text-accent ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <FiUploadCloud className="h-7 w-7" />
          {busy ? "Uploading…" : "Click to upload a photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
