"use client";

import { useState } from "react";
import { Select, Input, Button } from "antd";
import { useEquipment, Equipment } from "@/hooks/useEquipment";
import ImageUpload from "@/components/ImageUpload";

interface ChupChinhAnhFormProps {
  formData: {
    name: string;
    description: string;
    images: string[];
    photographyType: string;
    location: string;
    equipmentIds: string[];
  };
  onChange: (field: string, value: unknown) => void;
}

export default function ChupChinhAnhForm({
  formData,
  onChange,
}: ChupChinhAnhFormProps) {
  const { data: equipmentData } = useEquipment({ limit: 1000 });
  const equipmentList = equipmentData?.data || [];

  const [aspectRatioMode, setAspectRatioMode] = useState<"preset" | "custom">(
    "preset"
  );
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    string | number | undefined
  >(undefined);
  const [customRatio, setCustomRatio] = useState({ width: "", height: "" });
  const [showReplaceMode, setShowReplaceMode] = useState(false);

  const hasImages = formData.images && formData.images.length > 0;

  // Calculate aspect ratio
  const getAspectRatio = (): number | undefined => {
    if (aspectRatioMode === "preset") {
      if (selectedAspectRatio === "free") return undefined;
      return selectedAspectRatio as number;
    } else {
      // Custom ratio
      const width = parseFloat(customRatio.width);
      const height = parseFloat(customRatio.height);
      if (width > 0 && height > 0) {
        return width / height;
      }
      return undefined;
    }
  };

  const aspectRatio = getAspectRatio();
  const showUpload =
    aspectRatioMode === "preset"
      ? selectedAspectRatio !== undefined && selectedAspectRatio !== null
      : customRatio.width &&
        customRatio.height &&
        parseFloat(customRatio.width) > 0 &&
        parseFloat(customRatio.height) > 0;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên bộ ảnh <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Nhập tên bộ ảnh"
        />
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Mô tả
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all resize-none"
          placeholder="Nhập mô tả bộ ảnh"
        />
      </div>

      {/* Images Gallery */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Hình ảnh
        </label>

        {/* Show existing images if available */}
        {hasImages && !showReplaceMode && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden bg-midnight aspect-square"
                >
                  <img
                    src={url}
                    alt={`Ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Button
              type="default"
              onClick={() => {
                setShowReplaceMode(true);
                setSelectedAspectRatio(undefined);
                setCustomRatio({ width: "", height: "" });
              }}
              className="bg-spirit-cyan/20 text-spirit-cyan border border-spirit-cyan/30 hover:bg-spirit-cyan/30"
            >
              Thay ảnh
            </Button>
          </div>
        )}

        {/* Aspect Ratio Selection - Show when no images or in replace mode */}
        {(showReplaceMode || !hasImages) && (
          <div className="mb-4 space-y-4">
            <div className="flex gap-4">
              <Button
                type={aspectRatioMode === "preset" ? "primary" : "default"}
                onClick={() => setAspectRatioMode("preset")}
                className={
                  aspectRatioMode === "preset"
                    ? "bg-spirit-cyan text-midnight"
                    : ""
                }
              >
                Chọn tỉ lệ
              </Button>
              <Button
                type={aspectRatioMode === "custom" ? "primary" : "default"}
                onClick={() => setAspectRatioMode("custom")}
                className={
                  aspectRatioMode === "custom"
                    ? "bg-spirit-cyan text-midnight"
                    : ""
                }
              >
                Nhập tỉ lệ
              </Button>
              {hasImages && showReplaceMode && (
                <Button
                  type="default"
                  onClick={() => {
                    setShowReplaceMode(false);
                    setSelectedAspectRatio(undefined);
                    setCustomRatio({ width: "", height: "" });
                  }}
                  className="ml-auto"
                >
                  Hủy
                </Button>
              )}
            </div>

            {aspectRatioMode === "preset" ? (
              <Select
                value={selectedAspectRatio}
                onChange={(value) => setSelectedAspectRatio(value)}
                placeholder="Chọn tỉ lệ khung hình"
                className="w-full"
                options={[
                  { label: "Tự do (không giới hạn)", value: "free" },
                  { label: "1:1 (Vuông)", value: 1 },
                  { label: "4:3 (Màn hình)", value: 4 / 3 },
                  { label: "16:9 (Widescreen)", value: 16 / 9 },
                  { label: "3:2 (Ảnh)", value: 3 / 2 },
                  { label: "2:3 (Dọc)", value: 2 / 3 },
                  { label: "9:16 (Story)", value: 9 / 16 },
                  { label: "21:9 (Ultrawide)", value: 21 / 9 },
                ]}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ice-white text-xs font-medium mb-2">
                    Chiều rộng
                  </label>
                  <Input
                    type="number"
                    value={customRatio.width}
                    onChange={(e) =>
                      setCustomRatio({ ...customRatio, width: e.target.value })
                    }
                    placeholder="Ví dụ: 16"
                    className="w-full"
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-ice-white text-xs font-medium mb-2">
                    Chiều cao
                  </label>
                  <Input
                    type="number"
                    value={customRatio.height}
                    onChange={(e) =>
                      setCustomRatio({ ...customRatio, height: e.target.value })
                    }
                    placeholder="Ví dụ: 9"
                    className="w-full"
                    min="1"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Section - Only show when aspect ratio is selected */}
        {showUpload && (showReplaceMode || !hasImages) && (
          <>
            <ImageUpload
              label=""
              multiple
              multipleUrls={formData.images}
              onMultipleChange={(urls) => {
                onChange("images", urls);
                if (urls.length > 0) {
                  setShowReplaceMode(false);
                }
              }}
              aspectRatio={aspectRatio}
            />
            <p className="text-muted-blue text-xs mt-2">
              Tải lên các hình ảnh trong bộ ảnh. Bạn cũng có thể thêm URL thủ
              công bên dưới.
            </p>
            <textarea
              value={formData.images.join("\n")}
              onChange={(e) =>
                onChange(
                  "images",
                  e.target.value.split("\n").filter((url) => url.trim())
                )
              }
              rows={4}
              className="w-full px-4 py-3 mt-2 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all resize-none font-mono text-sm"
              placeholder="Hoặc dán URL hình ảnh ở đây (mỗi dòng một URL)"
            />
          </>
        )}
      </div>

      {/* Photography Type */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thể loại nhiếp ảnh
        </label>
        <Select
          value={formData.photographyType || undefined}
          onChange={(value) => onChange("photographyType", value)}
          placeholder="Chọn thể loại"
          className="w-full"
          options={[
            { label: "Chân dung", value: "Portrait" },
            { label: "Đường phố", value: "Street" },
            { label: "Sản phẩm", value: "Product" },
            { label: "Phong cảnh", value: "Landscape" },
            { label: "Thời trang", value: "Fashion" },
            { label: "Sự kiện", value: "Event" },
            { label: "Khác", value: "Other" },
          ]}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Địa điểm chụp
        </label>
        <Input
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="Nhập địa điểm chụp"
          className="w-full"
        />
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thiết bị sử dụng
        </label>
        <Select
          mode="multiple"
          value={formData.equipmentIds}
          onChange={(value) => onChange("equipmentIds", value)}
          placeholder="Chọn thiết bị"
          className="w-full"
          options={equipmentList.map((eq: Equipment) => ({
            label: `${eq.name} (${eq.type})`,
            value: eq._id,
          }))}
        />
      </div>
    </div>
  );
}
