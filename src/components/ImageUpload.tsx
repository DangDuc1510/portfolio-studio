"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Cropper from "react-easy-crop";
import { uploadImage } from "@/lib/api";
import type { Area, Point } from "react-easy-crop";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
  multipleUrls?: string[];
  aspectRatio?: number;
  cropShape?: "rect" | "round";
}

interface CropData {
  image: string;
  file: File;
  index?: number;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Tải ảnh lên",
  multiple = false,
  onMultipleChange,
  multipleUrls = [],
  aspectRatio,
  cropShape = "rect",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!multiple && value !== undefined) {
      setPreview(value || null);
    }
  }, [value, multiple]);

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    fileName: string
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], fileName, { type: blob.type });
          resolve(file);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropConfirm = async () => {
    if (!cropData || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const croppedFile = await getCroppedImg(
        cropData.image,
        croppedAreaPixels,
        cropData.file.name
      );

      if (multiple) {
        // Handle multiple files - upload current and continue with next
        const result = await uploadImage(croppedFile);
        const newUrls = [...multipleUrls, result.file.url];
        onMultipleChange?.(newUrls);

        // Cleanup current image URL
        if (cropData.image) {
          URL.revokeObjectURL(cropData.image);
        }

        // Process next file in queue
        setFileQueue((prev) => {
          const remaining = prev.slice(1);
          if (remaining.length > 0) {
            // Continue with next file
            const nextFile = remaining[0];
            const imageUrl = URL.createObjectURL(nextFile);
            setTimeout(() => {
              setCropData({ image: imageUrl, file: nextFile });
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setCroppedAreaPixels(null);
            }, 100);
          } else {
            // No more files, close crop modal
            setTimeout(() => {
              setShowCrop(false);
              setCropData(null);
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setCroppedAreaPixels(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }, 100);
          }
          return remaining;
        });
      } else {
        // Handle single file
        // Cleanup image URL
        if (cropData.image) {
          URL.revokeObjectURL(cropData.image);
        }

        const result = await uploadImage(croppedFile);
        const url = result.file.url;
        setPreview(url);
        onChange?.(url);
        setShowCrop(false);
        setCropData(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Crop/Upload failed:", error);
      alert("Xử lý ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    // Cleanup object URLs
    if (cropData?.image) {
      URL.revokeObjectURL(cropData.image);
    }
    // Cleanup file queue URLs
    fileQueue.forEach((file) => {
      // URLs will be created when needed, so we don't need to revoke here
    });

    setShowCrop(false);
    setCropData(null);
    setFileQueue([]);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cropData?.image) {
        URL.revokeObjectURL(cropData.image);
      }
    };
  }, [cropData]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && files.length > 0) {
      // Handle multiple files - add to queue and process first
      const filesArray = Array.from(files);
      setFileQueue(filesArray);
      const firstFile = filesArray[0];
      const imageUrl = URL.createObjectURL(firstFile);
      setCropData({ image: imageUrl, file: firstFile });
      setShowCrop(true);
    } else if (files[0]) {
      // Handle single file - show crop
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setCropData({ image: imageUrl, file });
      setShowCrop(true);
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

  const currentValue = multiple ? null : preview || value;

  return (
    <div>
      <label className="block text-ice-white text-sm font-medium mb-2">
        {label}
      </label>

      {/* Crop Modal */}
      {showCrop && cropData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90 p-4">
          <div className="bg-moonlight rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-ice-white text-lg font-semibold">
                  Cắt và chỉnh sửa ảnh
                </h3>
                {multiple && fileQueue.length > 0 && (
                  <p className="text-muted-blue text-sm mt-1">
                    Ảnh {multipleUrls.length + 1} /{" "}
                    {multipleUrls.length + fileQueue.length}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCropCancel}
                className="text-muted-blue hover:text-ice-white transition-colors"
              >
                <CloseOutlined className="text-xl" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[400px] bg-midnight rounded-lg overflow-hidden">
              <Cropper
                image={cropData.image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={cropShape}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-ice-white text-sm min-w-[60px]">
                  Zoom:
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-muted-blue text-sm w-12 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="px-4 py-2 rounded-lg border border-deep-slate text-ice-white hover:bg-midnight transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-spirit-cyan text-midnight hover:bg-spirit-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <LoadingOutlined className="animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CheckOutlined />
                      <span>Xác nhận</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {multiple ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-deep-slate rounded-xl p-8 text-center cursor-pointer hover:border-spirit-cyan transition-colors bg-moonlight/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading && !showCrop ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingOutlined className="text-3xl text-muted-blue animate-spin" />
                <span className="text-muted-blue text-sm">Đang tải lên...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadOutlined className="text-3xl text-muted-blue" />
                <span className="text-ice-white text-sm">
                  Nhấp để tải ảnh lên
                </span>
                <span className="text-muted-blue text-xs">
                  Hỗ trợ tải nhiều ảnh
                </span>
              </div>
            )}
          </div>

          {multipleUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {multipleUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden bg-midnight aspect-square"
                >
                  <img
                    src={url}
                    alt={`Ảnh tải lên ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMultiple(index)}
                    className="absolute top-2 right-2 p-2 bg-error/80 hover:bg-error text-pure-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="relative group rounded-xl overflow-hidden bg-midnight aspect-video max-w-md">
              <img
                src={currentValue}
                alt="Xem trước"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-error/80 hover:bg-error text-pure-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DeleteOutlined />
              </button>
            </div>
          ) : null}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-deep-slate rounded-xl p-6 text-center cursor-pointer hover:border-spirit-cyan transition-colors bg-moonlight/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading && !showCrop ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingOutlined className="text-2xl text-muted-blue animate-spin" />
                <span className="text-muted-blue text-sm">Đang tải lên...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadOutlined className="text-2xl text-muted-blue" />
                <span className="text-ice-white text-sm">
                  {currentValue ? "Thay đổi ảnh" : "Nhấp để tải ảnh lên"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
