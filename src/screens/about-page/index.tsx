"use client";

import { useAboutPage } from "@/hooks/useAboutPage";
import LoadingScreen from "@/components/LoadingScreen";
import AboutHero from "./components/AboutHero";
import StorySection from "./components/StorySection";
import TeamSection from "./components/TeamSection";
import ValuesSection from "./components/ValuesSection";
import StatsSection from "./components/StatsSection";
import TimelineSection from "./components/TimelineSection";
import PartnersSection from "./components/PartnersSection";
import AboutCTA from "./components/AboutCTA";

export default function AboutPage() {
  const { data: aboutPage, isLoading, error } = useAboutPage(false);

  if (isLoading) {
    return <LoadingScreen message="Đang tải trang về chúng tôi..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight ">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-pure-white mb-4">
            Có lỗi xảy ra
          </h2>
          <p className="text-muted-blue mb-6">
            Không thể tải trang về chúng tôi. Vui lòng thử lại sau.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-spirit-cyan to-mystic text-midnight font-bold hover:scale-110 transition-transform"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (!aboutPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-muted-blue text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-pure-white mb-4">
            Trang đang được cập nhật
          </h2>
          <p className="text-muted-blue">
            Nội dung trang "Về chúng tôi" đang được chuẩn bị. Vui lòng quay lại
            sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-midnight">
      {/* Hero Section */}
      <AboutHero content={aboutPage.heroSection} />

      {/* Story Section */}
      <StorySection content={aboutPage.storySection} />

      {/* Stats Section */}
      <StatsSection content={aboutPage.statsSection} />

      {/* Values Section */}
      <ValuesSection content={aboutPage.valuesSection} />

      {/* Team Section */}
      <TeamSection content={aboutPage.teamSection} />

      {/* Timeline Section (Optional) */}
      {aboutPage.timelineSection?.isVisible && (
        <TimelineSection content={aboutPage.timelineSection} />
      )}

      {/* Partners Section (Optional) */}
      {aboutPage.partnersSection?.isVisible && (
        <PartnersSection content={aboutPage.partnersSection} />
      )}

      {/* CTA Section */}
      <AboutCTA content={aboutPage.ctaSection} />
    </div>
  );
}
