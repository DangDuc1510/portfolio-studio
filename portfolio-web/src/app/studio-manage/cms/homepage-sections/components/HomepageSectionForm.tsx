"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useHomepageSections,
  useUpdateHomepageSection,
  HomepageSection,
} from "../hooks/useHomepageSections";

interface HomepageSectionFormProps {
  sectionId: string;
  onSuccess?: () => void;
}

export default function HomepageSectionForm({
  sectionId,
  onSuccess,
}: HomepageSectionFormProps) {
  const router = useRouter();
  const { data: sections = [], isLoading: isLoadingSections } = useHomepageSections();
  const updateSection = useUpdateHomepageSection();

  const section = sections.find((s : HomepageSection) => s._id === sectionId);
  const isLoading = isLoadingSections;
  const isSubmitting = updateSection.isPending;

  const [form, setForm] = useState<Omit<HomepageSection, "_id" | "sectionName">>({
    isVisible: true,
    content: {},
  });

  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (section) {
      setForm({
        isVisible: section.isVisible,
        content: section.content,
      });
      setJsonContent(JSON.stringify(section.content, null, 2));
      setJsonError("");
    }
  }, [section]);

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
    
    if (jsonError) {
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
      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          Section: {section.sectionName}
        </h3>
        <p className="text-gray-400 text-sm">
          Configure visibility and content for this homepage section
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) =>
              setForm({ ...form, isVisible: e.target.checked })
            }
            className="w-5 h-5 rounded border-white/10 bg-[#2C2C2C] text-[#4B4B4B] focus:ring-2 focus:ring-white/20 focus:ring-offset-0 focus:ring-offset-transparent"
          />
          <span className="text-white text-sm font-medium">
            Section is visible on homepage
          </span>
        </label>
      </div>

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

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !!jsonError}
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

