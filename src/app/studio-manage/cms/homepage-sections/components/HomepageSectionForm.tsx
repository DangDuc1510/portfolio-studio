"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Switch } from "antd";
import {
  useHomepageSections,
  useUpdateHomepageSection,
  HomepageSection,
} from "../hooks/useHomepageSections";
import ImageUpload from "@/components/ImageUpload";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface HomepageSectionFormProps {
  sectionId: string;
  onSuccess?: () => void;
}

export default function HomepageSectionForm({
  sectionId,
  onSuccess,
}: HomepageSectionFormProps) {
  const router = useRouter();
  const { data: sections = [], isLoading: isLoadingSections } =
    useHomepageSections();
  const updateSection = useUpdateHomepageSection();

  const section = sections.find((s: HomepageSection) => s._id === sectionId);
  const isLoading = isLoadingSections;
  const isSubmitting = updateSection.isPending;

  const [form, setForm] = useState<
    Omit<HomepageSection, "_id" | "sectionName">
  >({
    isVisible: true,
    content: {},
  });

  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [viewMode, setViewMode] = useState<"form" | "json">("form");

  useEffect(() => {
    if (section) {
      setForm({
        isVisible: section.isVisible,
        content: section.content || {},
      });
      setJsonContent(JSON.stringify(section.content || {}, null, 2));
      setJsonError("");
    }
  }, [section]);

  const updateContent = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
    // Sync JSON
    const newContent = { ...form.content, [key]: value };
    setJsonContent(JSON.stringify(newContent, null, 2));
  };

  const handleJsonChange = (value: string) => {
    setJsonContent(value);
    try {
      const parsed = JSON.parse(value);
      setForm((prev) => ({ ...prev, content: parsed }));
      setJsonError("");
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jsonError && viewMode === "json") {
      alert("Please fix JSON errors before saving");
      return;
    }

    try {
      await updateSection.mutateAsync({
        id: sectionId,
        data: form,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio-manage/cms/homepage-sections");
      }
    } catch (error) {
      console.error("Failed to save section:", error);
      alert("Failed to save section");
    }
  };

  const renderFormFields = () => {
    if (!section) return null;

    const content = form.content || {};
    const sectionName = section.sectionName.toLowerCase();

    switch (sectionName) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Title
              </label>
              <Input
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Hero Title"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Subtitle
              </label>
              <Input.TextArea
                value={content.subtitle || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="Hero Subtitle"
                rows={3}
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Background Image
              </label>
              <ImageUpload
                value={content.backgroundImage}
                onChange={(url) => updateContent("backgroundImage", url)}
                label="Upload Background Image"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Background Video URL (Optional)
              </label>
              <Input
                value={content.videoUrl || ""}
                onChange={(e) => updateContent("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=... or video file URL"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Primary CTA Button
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={content.primaryButtonText || ""}
                  onChange={(e) =>
                    updateContent("primaryButtonText", e.target.value)
                  }
                  placeholder="Button Text"
                  className="bg-[#2C2C2C]/80 border-white/10 text-white"
                />
                <Input
                  value={content.primaryButtonLink || ""}
                  onChange={(e) =>
                    updateContent("primaryButtonLink", e.target.value)
                  }
                  placeholder="Button Link (/products)"
                  className="bg-[#2C2C2C]/80 border-white/10 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Secondary CTA Button (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={content.secondaryButtonText || ""}
                  onChange={(e) =>
                    updateContent("secondaryButtonText", e.target.value)
                  }
                  placeholder="Button Text"
                  className="bg-[#2C2C2C]/80 border-white/10 text-white"
                />
                <Input
                  value={content.secondaryButtonLink || ""}
                  onChange={(e) =>
                    updateContent("secondaryButtonLink", e.target.value)
                  }
                  placeholder="Button Link (/contact)"
                  className="bg-[#2C2C2C]/80 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Title
              </label>
              <Input
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="About Section Title"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Description
              </label>
              <Input.TextArea
                value={content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="About description"
                rows={6}
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Image
              </label>
              <ImageUpload
                value={content.image}
                onChange={(url) => updateContent("image", url)}
                label="Upload About Image"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Stats (JSON Array)
              </label>
              <Input.TextArea
                value={
                  Array.isArray(content.stats)
                    ? JSON.stringify(content.stats, null, 2)
                    : JSON.stringify([], null, 2)
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContent("stats", parsed);
                  } catch (error) {
                    // Invalid JSON, keep as is
                  }
                }}
                placeholder='[{"label": "Years", "value": "10+"}, {"label": "Projects", "value": "500+"}]'
                rows={4}
                className="bg-[#2C2C2C]/80 border-white/10 text-white font-mono text-sm"
              />
              <p className="text-gray-400 text-xs mt-2">
                Array of stats objects with "label" and "value"
              </p>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Section Title
              </label>
              <Input
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Services Section Title"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Section Subtitle
              </label>
              <Input.TextArea
                value={content.subtitle || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="Section subtitle or description"
                rows={2}
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Services (JSON Array)
              </label>
              <Input.TextArea
                value={
                  Array.isArray(content.services)
                    ? JSON.stringify(content.services, null, 2)
                    : JSON.stringify([], null, 2)
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContent("services", parsed);
                  } catch (error) {
                    // Invalid JSON
                  }
                }}
                placeholder='[{"icon": "CameraOutlined", "title": "Photography", "description": "Professional photography services"}, ...]'
                rows={8}
                className="bg-[#2C2C2C]/80 border-white/10 text-white font-mono text-sm"
              />
              <p className="text-gray-400 text-xs mt-2">
                Array of service objects with "icon", "title", and "description"
              </p>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Section Title
              </label>
              <Input
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Testimonials Section Title"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Testimonials (JSON Array - Auto-filled from completed customers)
              </label>
              <Input.TextArea
                value={
                  Array.isArray(content.testimonials)
                    ? JSON.stringify(content.testimonials, null, 2)
                    : JSON.stringify([], null, 2)
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContent("testimonials", parsed);
                  } catch (error) {
                    // Invalid JSON
                  }
                }}
                placeholder='[{"name": "Customer Name", "message": "Great service!", "rating": 5}, ...]'
                rows={8}
                className="bg-[#2C2C2C]/80 border-white/10 text-white font-mono text-sm"
              />
              <p className="text-gray-400 text-xs mt-2">
                Array of testimonial objects (can be manually added or
                auto-filled from customers)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Title
              </label>
              <Input
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Section Title"
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Content
              </label>
              <Input.TextArea
                value={content.description || content.content || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateContent("description", value);
                  updateContent("content", value);
                }}
                placeholder="Section content"
                rows={6}
                className="bg-[#2C2C2C]/80 border-white/10 text-white"
              />
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Section not found</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            Section: {section.sectionName}
          </h3>
          <p className="text-gray-400 text-sm">
            Configure visibility and content for this homepage section
          </p>
        </div>
        <div className="flex gap-2 bg-[#2C2C2C]/80 border border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setViewMode("form")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "form"
                ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setViewMode("json")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "json"
                ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            checked={form.isVisible}
            onChange={(checked) => setForm({ ...form, isVisible: checked })}
          />
          <span className="text-white text-sm font-medium">
            Section is visible on homepage
          </span>
        </label>
      </div>

      {viewMode === "form" ? (
        <div className="space-y-6">{renderFormFields()}</div>
      ) : (
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Content (JSON) <span className="text-red-400">*</span>
          </label>
          <textarea
            value={jsonContent}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={15}
            className={`w-full px-4 py-3 bg-[#2C2C2C]/80 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none font-mono text-sm ${
              jsonError
                ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                : "border-white/10 focus:border-white/30 focus:ring-white/20"
            }`}
            placeholder='{"title": "Example", "description": "Content here"}'
          />
          {jsonError && (
            <p className="text-red-400 text-xs mt-2">{jsonError}</p>
          )}
          <p className="text-gray-400 text-xs mt-2">
            Enter valid JSON content for this section
          </p>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || (viewMode === "json" && !!jsonError)}
          className="flex-1 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          {isSubmitting ? "Saving..." : "Update Section"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-transparent hover:bg-[#2C2C2C] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
