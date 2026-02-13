"use client";

import React from "react";

type CloudinaryImageUploadProps = {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
};

export default function CloudinaryImageUpload({
  currentImageUrl,
  onImageUploaded,
  className = "",
  buttonText = "Upload Image",
  showPreview = true,
}: CloudinaryImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>(currentImageUrl || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing. Please set environment variables.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Handle completion
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } else {
            reject(new Error("Failed to upload image"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });
      });

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.send(formData);

      const imageUrl = await uploadPromise;

      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
      setUploadProgress(100);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setUploadProgress(0);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="cloudinary-upload"
        disabled={uploading}
      />

      {/* Preview Image */}
      {showPreview && previewUrl && !uploading && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-xl border-[3px] border-[#2D2D2D] shadow-lg"
          />
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-4 space-y-2">
          <div className="relative w-full bg-white/20 rounded-full h-3 border-2 border-[#2D2D2D] overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0058C9] to-[#0070E0] transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-sm text-white font-bold text-center">
            Uploading... {uploadProgress}%
          </div>
        </div>
      )}

      {/* Upload Button */}
      <label
        htmlFor="cloudinary-upload"
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] text-white text-sm font-bold cursor-pointer transition-all ${
          uploading
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "hover:bg-[#0046A3] hover:scale-105 active:scale-95"
        }`}
      >
        {uploading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{uploadProgress}%</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>{buttonText}</span>
          </>
        )}
      </label>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-100 text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Success Message */}
      {!uploading && uploadProgress === 100 && !error && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/20 border-2 border-green-500 text-green-100 text-sm font-semibold">
          ✓ Upload successful!
        </div>
      )}
    </div>
  );
}

