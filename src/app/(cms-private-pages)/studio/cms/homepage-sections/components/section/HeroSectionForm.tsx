"use client";
import { Input } from "antd";

interface HeroSectionFormProps {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}

const getStringValue = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

export default function HeroSectionForm({
  content,
  updateContent,
}: HeroSectionFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Heading 1 <span className="text-error">*</span>
        </label>
        <Input
          value={getStringValue(content.heading1)}
          onChange={(e) => updateContent("heading1", e.target.value)}
          placeholder="Creative Developer"
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
        <p className="text-muted-blue text-xs mt-1">
          Dòng tiêu đề chính của hero section
        </p>
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Heading 2
        </label>
        <Input
          value={getStringValue(content.heading2)}
          onChange={(e) => updateContent("heading2", e.target.value)}
          placeholder="& Designer"
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
        <p className="text-muted-blue text-xs mt-1">
          Dòng tiêu đề phụ (sẽ hiển thị với gradient gold)
        </p>
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Subheading 1 <span className="text-error">*</span>
        </label>
        <Input.TextArea
          value={getStringValue(content.subheading1)}
          onChange={(e) => updateContent("subheading1", e.target.value)}
          placeholder="Crafting beautiful digital experiences with modern web technologies"
          rows={2}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
        <p className="text-muted-blue text-xs mt-1">Dòng mô tả chính</p>
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Subheading 2
        </label>
        <Input.TextArea
          value={getStringValue(content.subheading2)}
          onChange={(e) => updateContent("subheading2", e.target.value)}
          placeholder="Bringing fantasy to life through code"
          rows={2}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
        <p className="text-muted-blue text-xs mt-1">
          Dòng mô tả phụ (sẽ hiển thị với màu muted-blue)
        </p>
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thẻ 
        </label>
        <Input.TextArea
          value={
            Array.isArray(content.tags)
              ? JSON.stringify(content.tags, null, 2)
              : JSON.stringify(
                  ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
                  null,
                  2
                )
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (Array.isArray(parsed)) {
                updateContent("tags", parsed);
              }
            } catch {
              // Invalid JSON, keep as is
            }
          }}
          placeholder='["React", "Next.js", "TypeScript", "Tailwind", "Node.js"]'
          rows={4}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white font-mono text-sm"
        />

      </div>
    </div>
  );
}
