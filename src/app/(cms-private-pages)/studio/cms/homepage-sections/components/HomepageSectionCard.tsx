"use client";
import Link from "next/link";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { HomepageSection } from "@/hooks/useHomepageSections";
import HeroSectionCard from "./section/HeroSectionCard";

interface HomepageSectionCardProps {
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

export default function HomepageSectionCard({
  section,
  onDelete,
  isDeleting = false,
}: HomepageSectionCardProps) {
  const sectionName = section.sectionName.toLowerCase();

  // Render hero section card separately
  if (sectionName === "hero") {
    return (
      <HeroSectionCard
        section={section}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    );
  }

  // Default card for other sections
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
          <div className="bg-midnight border border-spirit-cyan/20 rounded-lg p-3 h-32 overflow-y-auto">
            {hasStringValue(section.content?.title) ? (
              <div className="space-y-1">
                <p className="text-ice-white text-sm font-medium">
                  {getStringValue(section.content.title)}
                </p>
                {hasStringValue(section.content.subtitle) && (
                  <p className="text-muted-blue text-xs line-clamp-2">
                    {getStringValue(section.content.subtitle)}
                  </p>
                )}
                {hasStringValue(section.content.description) && (
                  <p className="text-muted-blue text-xs line-clamp-2">
                    {getStringValue(section.content.description)}
                  </p>
                )}
                {(hasStringValue(section.content.backgroundImage) ||
                  hasStringValue(section.content.image)) && (
                  <p className="text-spirit-cyan text-xs">✓ Đã tải hình ảnh</p>
                )}
                {(hasStringValue(section.content.primaryButtonText) ||
                  hasStringValue(section.content.secondaryButtonText)) && (
                  <p className="text-spirit-cyan text-xs">
                    ✓ Đã cấu hình nút CTA
                  </p>
                )}
                {Array.isArray(section.content.services) &&
                  section.content.services.length > 0 && (
                    <p className="text-mystic text-xs">
                      ✓ {section.content.services.length} dịch vụ
                    </p>
                  )}
              </div>
            ) : (
              <pre className="text-muted-blue text-xs whitespace-pre-wrap font-mono">
                {JSON.stringify(section.content || {}, null, 2).slice(0, 150)}
                {JSON.stringify(section.content || {}, null, 2).length > 150 &&
                  "..."}
              </pre>
            )}
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
          {onDelete &&
            sectionName !==
              "about" && sectionName !== "featured-content" && (
                <button
                  onClick={() => onDelete(section._id, section.sectionName)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-error/15 text-error hover:text-error rounded-lg transition-all border border-error/50 hover:border-error disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DeleteOutlined />
                </button>
              )}
        </div>
      </div>
    </div>
  );
}
