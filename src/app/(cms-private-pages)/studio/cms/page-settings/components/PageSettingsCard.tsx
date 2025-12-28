"use client";

import Link from "next/link";
import {
  EditOutlined,
} from "@ant-design/icons";
import { usePageSettings, PageType } from "@/hooks/usePageSettings";
import LoadingScreen from "@/components/LoadingScreen";

interface PageSettingsCardProps {
  pageType: PageType;
}

const pageTypeLabels: Record<PageType, string> = {
  QUAY_DUNG: "Quay dựng",
  THIET_KE: "Thiết kế",
  CHUP_CHINH_ANH: "Chụp - Chỉnh ảnh",
};

const pageTypeRoutes: Record<PageType, string> = {
  QUAY_DUNG: "/studio/cms/page-settings/quay-dung",
  THIET_KE: "/studio/cms/page-settings/thiet-ke",
  CHUP_CHINH_ANH: "/studio/cms/page-settings/chup-chinh-anh",
};

const pageTypeClientRoutes: Record<PageType, string> = {
  QUAY_DUNG: "/quay-dung",
  THIET_KE: "/thiet-ke",
  CHUP_CHINH_ANH: "/chup-chinh-anh",
};

export default function PageSettingsCard({ pageType }: PageSettingsCardProps) {
  const { data: pageSettings, isLoading } = usePageSettings(pageType);

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 border-2 border-spirit-cyan/20">
        <LoadingScreen message="Đang tải..." fullScreen={false} />
      </div>
    );
  }

  const label = pageTypeLabels[pageType];
  const editRoute = pageTypeRoutes[pageType];
  const clientRoute = pageTypeClientRoutes[pageType];

  return (
    <div className="glass-card rounded-lg overflow-hidden hover-lift border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 flex flex-col justify-between group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-pure-white text-xl font-bold mb-2">{label}</h3>
            <p className="text-muted-blue text-sm line-clamp-2">
              {pageSettings?.description || "Chưa có mô tả"}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-blue">Tiêu đề:</span>
            <span className="text-ice-white font-medium">
              {pageSettings?.title || "Chưa có"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-blue">Sản phẩm nổi bật:</span>
            <span className="text-ice-white font-medium">
              {pageSettings?.featuredProductIds?.length || 0} sản phẩm
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-moonlight-light border-t border-spirit-cyan/10 flex items-center justify-between gap-2">
        <Link
          href={clientRoute}
          target="_blank"
          rel="noopener noreferrer"
          className="text-spirit-cyan hover:text-secondary-cyan transition-colors text-sm font-medium"
        >
          Xem trang →
        </Link>
        <Link
          href={editRoute}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-cyan hover:opacity-90 text-midnight rounded-lg transition-all font-medium text-sm"
        >
          <EditOutlined />
          <span>Chỉnh sửa</span>
        </Link>
      </div>
    </div>
  );
}
