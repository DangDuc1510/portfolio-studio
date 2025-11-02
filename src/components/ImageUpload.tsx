"use client";
import { useState, useRef, useEffect } from "react";
import { UploadOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { uploadImage } from "@/lib/api";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
  multipleUrls?: string[];
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  multiple = false,
  onMultipleChange,
  multipleUrls = [],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!multiple && value !== undefined) {
      setPreview(value || null);
    }
  }, [value, multiple]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && files.length > 0) {
      // Handle multiple files
      setUploading(true);
      try {
        const uploadPromises = Array.from(files).map((file) => uploadImage(file));
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((result) => result.file.url);
        const allUrls = [...multipleUrls, ...newUrls];
        onMultipleChange?.(allUrls);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload images");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else if (files[0]) {
      // Handle single file
      setUploading(true);
      try {
        const result = await uploadImage(files[0]);
        const url = result.file.url;
        setPreview(url);
        onChange?.(url);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.("");
  };

  const handleRemoveMultiple = (index: number) => {
    const newUrls = multipleUrls.filter((_, i) => i !== index);
    onMultipleChange?.(newUrls);
  };

  const currentValue = multiple ? null : (preview || value);

  return (
    <div>
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>

      {multiple ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-white/40 transition-colors bg-[#2C2C2C]/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingOutlined className="text-3xl text-gray-400 animate-spin" />
                <span className="text-gray-400 text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadOutlined className="text-3xl text-gray-400" />
                <span className="text-white text-sm">Click to upload images</span>
                <span className="text-gray-400 text-xs">
                  Multiple images supported
                </span>
              </div>
            )}
          </div>

          {multipleUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {multipleUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden bg-[#2C2C2C] aspect-square"
                >
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMultiple(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentValue ? (
            <div className="relative group rounded-xl overflow-hidden bg-[#2C2C2C] aspect-video max-w-md">
              <img
                src={currentValue}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DeleteOutlined />
              </button>
            </div>
          ) : null}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-white/40 transition-colors bg-[#2C2C2C]/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingOutlined className="text-2xl text-gray-400 animate-spin" />
                <span className="text-gray-400 text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadOutlined className="text-2xl text-gray-400" />
                <span className="text-white text-sm">
                  {currentValue ? "Change Image" : "Click to upload image"}
                </span>
                <span className="text-gray-400 text-xs">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

