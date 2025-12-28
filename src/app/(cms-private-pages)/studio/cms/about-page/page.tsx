"use client";

import { useState, useEffect } from "react";
import { useAboutPage, useUpdateAboutPage } from "@/hooks/useAboutPage";
import { IAboutPage } from "@/lib/models/AboutPage";
import { Button, Tabs, message } from "antd";
import { SaveOutlined, CheckCircleOutlined } from "@ant-design/icons";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSectionForm from "./components/sections/HeroSectionForm";
import StorySectionForm from "./components/sections/StorySectionForm";
import TeamSectionForm from "./components/sections/TeamSectionForm";
import ValuesSectionForm from "./components/sections/ValuesSectionForm";
import StatsSectionForm from "./components/sections/StatsSectionForm";
import TimelineSectionForm from "./components/sections/TimelineSectionForm";
import PartnersSectionForm from "./components/sections/PartnersSectionForm";
import CTASectionForm from "./components/sections/CTASectionForm";
import SEOForm from "./components/sections/SEOForm";

export default function AboutPageCMS() {
  const { data: aboutPage, isLoading } = useAboutPage(true);
  const updateAboutPage = useUpdateAboutPage();
  const [formData, setFormData] = useState<Partial<IAboutPage> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when aboutPage is loaded
  useEffect(() => {
    if (aboutPage) {
      setFormData(aboutPage);
    } else {
      // Set default values if no data exists
      setFormData(getDefaultAboutPageData());
    }
  }, [aboutPage]);

  const handleSave = async () => {
    if (!formData) return;

    try {
      const dataToSave = {
        ...formData,
        isPublished: true,
      };

      await updateAboutPage.mutateAsync(dataToSave);
      message.success("Đã lưu trang thành công!");
      setHasChanges(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu trang");
      console.error(error);
    }
  };

  const updateSection = <K extends keyof IAboutPage>(
    section: K,
    data: IAboutPage[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải dữ liệu..." fullScreen={false} />;
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-blue">Không có dữ liệu</div>
      </div>
    );
  }

  const tabItems = [
    {
      key: "hero",
      label: "Hero",
      children: (
        <HeroSectionForm
          data={formData.heroSection!}
          onChange={(data) => updateSection("heroSection", data)}
        />
      ),
    },
    {
      key: "story",
      label: "Câu chuyện",
      children: (
        <StorySectionForm
          data={formData.storySection!}
          onChange={(data) => updateSection("storySection", data)}
        />
      ),
    },
    {
      key: "team",
      label: "Đội ngũ",
      children: (
        <TeamSectionForm
          data={formData.teamSection!}
          onChange={(data) => updateSection("teamSection", data)}
        />
      ),
    },
    {
      key: "values",
      label: "Giá trị",
      children: (
        <ValuesSectionForm
          data={formData.valuesSection!}
          onChange={(data) => updateSection("valuesSection", data)}
        />
      ),
    },
    {
      key: "stats",
      label: "Thống kê",
      children: (
        <StatsSectionForm
          data={formData.statsSection!}
          onChange={(data) => updateSection("statsSection", data)}
        />
      ),
    },
    {
      key: "timeline",
      label: "Lịch sử",
      children: (
        <TimelineSectionForm
          data={formData.timelineSection!}
          onChange={(data) => updateSection("timelineSection", data)}
        />
      ),
    },
    {
      key: "partners",
      label: "Đối tác",
      children: (
        <PartnersSectionForm
          data={formData.partnersSection!}
          onChange={(data) => updateSection("partnersSection", data)}
        />
      ),
    },
    {
      key: "cta",
      label: "CTA",
      children: (
        <CTASectionForm
          data={formData.ctaSection!}
          onChange={(data) => updateSection("ctaSection", data)}
        />
      ),
    },
    {
      key: "seo",
      label: "SEO",
      children: (
        <SEOForm
          data={formData.seo!}
          onChange={(data) => updateSection("seo", data)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pure-white mb-2">
            Quản lý trang "Về chúng tôi"
          </h1>
          <p className="text-muted-blue">
            Chỉnh sửa nội dung và thông tin về studio
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={updateAboutPage.isPending}
            size="large"
            className="bg-gradient-to-r from-golden to-soft-gold border-0 text-midnight font-bold hover:scale-105"
          >
            Lưu
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      {formData.isPublished && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success/40 text-success">
          <CheckCircleOutlined />
          <span className="font-medium">Đã xuất bản</span>
        </div>
      )}

      {/* Changes Warning */}
      {hasChanges && (
        <div className="glass-card rounded-xl p-4 border border-warning/40 bg-warning/10">
          <p className="text-warning">
            ⚠️ Bạn có thay đổi chưa được lưu. Nhớ lưu trước khi rời khỏi trang.
          </p>
        </div>
      )}

      {/* Tabs for different sections */}
      <div className="glass-card rounded-xl p-6 border border-spirit-cyan/20">
        <Tabs
          items={tabItems}
          size="large"
          className="cms-tabs"
          tabBarStyle={{
            borderBottom: "1px solid rgba(79, 209, 255, 0.2)",
            marginBottom: "24px",
          }}
        />
      </div>
    </div>
  );
}

// Default data structure
function getDefaultAboutPageData(): Partial<IAboutPage> {
  return {
    heroSection: {
      title: "Về chúng tôi",
      subtitle: "Câu chuyện của chúng tôi",
      backgroundImage: "",
      backgroundVideo: "",
    },
    storySection: {
      title: "Câu chuyện của chúng tôi",
      content: "",
      images: [],
    },
    teamSection: {
      title: "Đội ngũ của chúng tôi",
      subtitle: "",
      members: [],
    },
    valuesSection: {
      title: "Giá trị cốt lõi",
      subtitle: "",
      values: [],
    },
    statsSection: {
      isVisible: true,
      stats: [],
    },
    timelineSection: {
      isVisible: false,
      title: "Hành trình của chúng tôi",
      milestones: [],
    },
    partnersSection: {
      isVisible: false,
      title: "Đối tác & Khách hàng",
      logos: [],
    },
    ctaSection: {
      title: "Sẵn sàng hợp tác?",
      description: "Hãy liên hệ với chúng tôi ngay hôm nay",
      buttonText: "Liên hệ ngay",
      buttonLink: "/",
    },
    seo: {
      metaTitle: "Về chúng tôi | Portfolio Studio",
      metaDescription: "Tìm hiểu về Portfolio Studio",
      keywords: [],
    },
    isPublished: false,
  };
}
