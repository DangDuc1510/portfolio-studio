import { Metadata } from "next";
import AboutPage from "@/screens/about-page";

// SEO Metadata
export const metadata: Metadata = {
  title: "Về chúng tôi | Portfolio Studio",
  description:
    "Tìm hiểu về Portfolio Studio - đội ngũ sáng tạo chuyên nghiệp trong lĩnh vực quay dựng, thiết kế và chụp ảnh.",
  keywords: [
    "về chúng tôi",
    "portfolio studio",
    "đội ngũ",
    "sáng tạo",
    "chuyên nghiệp",
  ],
  openGraph: {
    title: "Về chúng tôi | Portfolio Studio",
    description:
      "Tìm hiểu về Portfolio Studio - đội ngũ sáng tạo chuyên nghiệp trong lĩnh vực quay dựng, thiết kế và chụp ảnh.",
    type: "website",
  },
};

export default function AboutPageRoute() {
  return <AboutPage />;
}
