"use client";

import React, { useState } from "react";
import { Select, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageUpload from "@/components/ImageUpload";

interface ThietKeFormProps {
  formData: {
    name: string;
    description: string;
    images: string[]; // Ấn phẩm (gộp coverImage và gallery)
    designType: string;
    clientType: string;
    toolsUsed: string[];
    aspectRatio?: string;
  };
  onChange: (field: string, value: unknown) => void;
}

export default function ThietKeForm({ formData, onChange }: ThietKeFormProps) {
  const [newTool, setNewTool] = useState("");
  const [aspectRatioMode, setAspectRatioMode] = useState<"preset" | "custom">(
    "preset"
  );
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    string | number | undefined
  >(undefined);
  const [customRatio, setCustomRatio] = useState({ width: "", height: "" });
  const [showReplaceMode, setShowReplaceMode] = useState(false);

  const hasImages = formData.images && formData.images.length > 0;

  const addTool = () => {
    if (newTool.trim()) {
      const currentTools = Array.isArray(formData.toolsUsed)
        ? formData.toolsUsed
        : [];
      const newTools = [...currentTools, newTool.trim()];
      console.log("ThietKeForm - Adding tool:", {
        currentTools,
        newTool: newTool.trim(),
        newTools,
      });
      onChange("toolsUsed", newTools);
      setNewTool("");
    }
  };

  const removeTool = (index: number) => {
    const currentTools = Array.isArray(formData.toolsUsed)
      ? formData.toolsUsed
      : [];
    const newTools = currentTools.filter((_, i) => i !== index);
    onChange("toolsUsed", newTools);
  };

  // Convert aspect ratio number to string format (e.g., 16/9, 4/3)
  const convertAspectRatioToString = (ratio: number | undefined): string | undefined => {
    if (!ratio) return undefined;
    
    // Common ratios mapping - using computed values
    const commonRatios: Array<{ value: number; string: string }> = [
      { value: 1, string: "1/1" },
      { value: 4 / 3, string: "4/3" },
      { value: 16 / 9, string: "16/9" },
      { value: 3 / 2, string: "3/2" },
      { value: 2 / 3, string: "2/3" },
      { value: 9 / 16, string: "9/16" },
      { value: 21 / 9, string: "21/9" },
    ];

    // Check if it's a common ratio (with small tolerance for floating point)
    for (const { value, string } of commonRatios) {
      if (Math.abs(ratio - value) < 0.001) {
        return string;
      }
    }

    // For custom ratios, try to simplify
    // Find GCD to simplify the ratio
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    
    // Try to find a reasonable representation
    for (let denom = 1; denom <= 100; denom++) {
      const num = Math.round(ratio * denom);
      if (Math.abs(ratio - num / denom) < 0.01) {
        const divisor = gcd(num, denom);
        return `${num / divisor}/${denom / divisor}`;
      }
    }

    // Fallback: return as decimal ratio
    return ratio.toFixed(2);
  };

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

  // Update aspectRatio in formData when it changes
  React.useEffect(() => {
    const aspectRatioString = convertAspectRatioToString(aspectRatio);
    if (aspectRatioString && aspectRatioString !== formData.aspectRatio) {
      onChange("aspectRatio", aspectRatioString);
    }
  }, [aspectRatio, formData.aspectRatio, onChange]);

  // Initialize selectedAspectRatio from formData.aspectRatio (only once on mount)
  React.useEffect(() => {
    if (formData.aspectRatio && !selectedAspectRatio && aspectRatioMode === "preset") {
      // Try to match with preset values
      const ratioMap: Record<string, number> = {
        "1/1": 1,
        "4/3": 4/3,
        "16/9": 16/9,
        "3/2": 3/2,
        "2/3": 2/3,
        "9/16": 9/16,
        "21/9": 21/9,
      };
      if (ratioMap[formData.aspectRatio]) {
        setSelectedAspectRatio(ratioMap[formData.aspectRatio]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          Tên dự án <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Nhập tên dự án thiết kế"
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
          placeholder="Nhập mô tả dự án"
        />
      </div>

      {/* Ấn phẩm (Artwork) - Gộp coverImage và gallery */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Ấn phẩm{" "}
          <span className="text-muted-blue text-xs font-normal">
            (Hình ảnh đầu tiên sẽ được dùng làm ảnh bìa)
          </span>
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
              Tải lên nhiều hình ảnh cho dự án thiết kế. Hình ảnh đầu tiên sẽ
              được dùng làm ảnh bìa. Bạn cũng có thể thêm URL thủ công bên dưới.
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
              placeholder="Hoặc dán URL hình ảnh ở đây (mỗi dòng một URL). Hình ảnh đầu tiên sẽ là ảnh bìa."
            />
          </>
        )}
      </div>

      {/* Design Type & Client Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Loại thiết kế
          </label>
          <Select
            value={formData.designType || undefined}
            onChange={(value) => onChange("designType", value)}
            placeholder="Chọn loại thiết kế"
            className="w-full"
            options={[
              { label: "Branding", value: "Branding" },
              { label: "UI/UX", value: "UI/UX" },
              { label: "Poster", value: "Poster" },
              { label: "Logo", value: "Logo" },
              { label: "Packaging", value: "Packaging" },
              { label: "Khác", value: "Other" },
            ]}
          />
        </div>

        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Loại khách hàng
          </label>
          <Select
            value={formData.clientType || undefined}
            onChange={(value) => onChange("clientType", value)}
            placeholder="Chọn loại khách hàng"
            className="w-full"
            options={[
              { label: "Cá nhân", value: "Cá nhân" },
              { label: "Doanh nghiệp", value: "Doanh nghiệp" },
            ]}
          />
        </div>
      </div>

      {/* Tools Used */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Công cụ sử dụng
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            placeholder="Nhập tên công cụ (Figma, Photoshop, Illustrator...)"
            onPressEnter={addTool}
            className="flex-1"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addTool}>
            Thêm
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(formData.toolsUsed) &&
            formData.toolsUsed.map((tool, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-spirit-cyan/20 text-spirit-cyan rounded-full text-sm"
              >
                {tool}
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="hover:text-error transition-colors"
                >
                  <DeleteOutlined />
                </button>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
