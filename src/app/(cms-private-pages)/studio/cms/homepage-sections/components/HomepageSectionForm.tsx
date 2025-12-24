"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Switch } from "antd";
import {
  useHomepageSections,
  useUpdateHomepageSection,
  HomepageSection,
} from "@/hooks/useHomepageSections";
import HeroSectionForm from "./section/HeroSectionForm";
import AboutSectionForm from "./section/AboutSectionForm";
import FeaturedContentSectionForm from "./section/FeaturedContentSectionForm";
import FooterSectionForm from "./section/FooterSectionForm";
import LoadingScreen from "@/components/LoadingScreen";

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

  useEffect(() => {
    if (section) {
      setForm({
        isVisible: section.isVisible,
        content: section.content || {},
      });
    }
  }, [section]);

  const updateContent = (key: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSection.mutateAsync({
        id: sectionId,
        data: form,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio/cms/homepage-sections");
      }
    } catch {
      alert("Không thể lưu section");
    }
  };

  const getStringValue = (value: unknown): string => {
    return typeof value === "string" ? value : "";
  };

  const getStringOrUndefined = (value: unknown): string | undefined => {
    return typeof value === "string" ? value : undefined;
  };

  const renderFormFields = () => {
    if (!section) return null;

    const content = form.content || {};
    const sectionName = section.sectionName.toLowerCase();

    switch (sectionName) {
      case "hero":
        return (
          <HeroSectionForm content={content} updateContent={updateContent} />
        );

      case "about":
        return (
          <AboutSectionForm content={content} updateContent={updateContent} />
        );

      case "featured-content":
        return (
          <FeaturedContentSectionForm
            content={content}
            updateContent={updateContent}
          />
        );

      case "footer":
        return (
          <FooterSectionForm content={content} updateContent={updateContent} />
        );

      case "services":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Tiêu đề phần
              </label>
              <Input
                value={getStringValue(content.title)}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Tiêu đề phần Services"
                className="bg-moonlight border-spirit-cyan/20 text-ice-white"
              />
            </div>
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Phụ đề phần
              </label>
              <Input.TextArea
                value={getStringValue(content.subtitle)}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="Phụ đề hoặc mô tả phần"
                rows={2}
                className="bg-moonlight border-spirit-cyan/20 text-ice-white"
              />
            </div>
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Dịch vụ (JSON Array)
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
                  } catch {
                    // Invalid JSON
                  }
                }}
                placeholder='[{"icon": "CameraOutlined", "title": "Nhiếp ảnh", "description": "Dịch vụ nhiếp ảnh chuyên nghiệp"}, ...]'
                rows={8}
                className="bg-moonlight border-spirit-cyan/20 text-ice-white font-mono text-sm"
              />
              <p className="text-muted-blue text-xs mt-2">
                Mảng các object dịch vụ với "icon", "title", và "description"
              </p>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Tiêu đề phần
              </label>
              <Input
                value={getStringValue(content.title)}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Tiêu đề phần Testimonials"
                className="bg-moonlight border-spirit-cyan/20 text-ice-white"
              />
            </div>
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Đánh giá (JSON Array)
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
                  } catch {
                    // Invalid JSON
                  }
                }}
                placeholder='[{"name": "Tên khách hàng", "message": "Dịch vụ tuyệt vời!", "rating": 5}, ...]'
                rows={8}
                className="bg-moonlight border-spirit-cyan/20 text-ice-white font-mono text-sm"
              />
              <p className="text-muted-blue text-xs mt-2">
                Mảng các object đánh giá (quản lý thủ công)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Tiêu đề
              </label>
              <Input
                value={getStringValue(content.title)}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Tiêu đề phần"
                className="bg-moonlight border-spirit-cyan/20 text-ice-white"
              />
            </div>
            <div>
              <label className="block text-ice-white text-sm font-medium mb-2">
                Nội dung
              </label>
              <Input.TextArea
                value={
                  getStringValue(content.description) ||
                  getStringValue(content.content)
                }
                onChange={(e) => {
                  const value = e.target.value;
                  updateContent("description", value);
                  updateContent("content", value);
                }}
                placeholder="Nội dung phần"
                rows={6}
                className="bg-moonlight border-spirit-cyan/20 text-ice-white"
              />
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải thông tin section..." fullScreen={false} />;
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-blue">Không tìm thấy section</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-pure-white mb-2">
          Section: {section.sectionName}
        </h3>
        <p className="text-muted-blue text-sm">
          Cấu hình hiển thị và nội dung cho section trang chủ này
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            checked={form.isVisible}
            onChange={(checked) => setForm({ ...form, isVisible: checked })}
          />
          <span className="text-ice-white text-sm font-medium">
            Section đang hiển thị trên trang chủ
          </span>
        </label>
      </div>

      <div className="space-y-6">{renderFormFields()}</div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-secondary-cyan hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          {isSubmitting ? "Đang lưu..." : "Cập nhật Section"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-transparent hover:bg-moonlight-light disabled:opacity-50 disabled:cursor-not-allowed text-ice-white rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
