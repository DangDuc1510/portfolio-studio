"use client";
import Link from "next/link";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { HomepageSection } from "@/hooks/useHomepageSections";

interface HeroSectionCardProps {
  section: HomepageSection;
  onDelete?: (id: string, sectionName: string) => void;
  isDeleting?: boolean;
}

const getStringValue = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const hasStringValue = (value: unknown): boolean => {
  return typeof value === "string" && value.length > 0;
};

export default function HeroSectionCard({
  section,
  onDelete,
  isDeleting = false,
}: HeroSectionCardProps) {
  const content = section.content || {};

  return (
    <div className="glass-card rounded-lg overflow-hidden hover-lift border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 flex flex-col justify-between group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-pure-white text-xl font-bold mb-2">
              {section.sectionName}
            </h3>
            <div className="flex items-center gap-2">
              {section.isVisible ? (
                <>
                  <EyeOutlined className="text-spirit-cyan" />
                  <span className="text-spirit-cyan text-sm font-medium">
                    Đang hiển thị
                  </span>
                </>
              ) : (
                <>
                  <EyeInvisibleOutlined className="text-muted-blue" />
                  <span className="text-muted-blue text-sm font-medium">
                    Đã ẩn
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-muted-blue text-xs mb-2 font-medium">
            Xem trước nội dung:
          </p>
          <div className="bg-midnight border border-spirit-cyan/20 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div className="space-y-1">
              {hasStringValue(content.heading1) && (
                <p className="text-ice-white text-sm font-medium">
                  {getStringValue(content.heading1)}
                  {hasStringValue(content.heading2) && (
                    <span className="text-mystic">
                      {" "}
                      {getStringValue(content.heading2)}
                    </span>
                  )}
                </p>
              )}
              {hasStringValue(content.subheading1) && (
                <p className="text-muted-blue text-xs line-clamp-2">
                  {getStringValue(content.subheading1)}
                </p>
              )}
              {hasStringValue(content.subheading2) && (
                <p className="text-muted-blue text-xs line-clamp-1">
                  {getStringValue(content.subheading2)}
                </p>
              )}
              {Array.isArray(content.tags) && content.tags.length > 0 && (
                <p className="text-spirit-cyan text-xs">
                  ✓ {content.tags.length} tags
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/studio/cms/homepage-sections/edit/${section._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-cyan hover:opacity-90 text-midnight rounded-lg transition-all border border-spirit-cyan/20 font-medium"
          >
            <EditOutlined />
            <span>Chỉnh sửa</span>
          </Link>
          
        </div>
      </div>
    </div>
  );
}
