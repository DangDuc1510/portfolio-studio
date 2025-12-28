"use client";

import PageSettingsCard from "./components/PageSettingsCard";
import { PageType } from "@/hooks/usePageSettings";

const pageTypes: PageType[] = ["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"];

export default function PageSettingsListPage() {
  return (
    <div className="text-ice-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-pure-white">
            Cài đặt trang sản phẩm
          </h1>
          <p className="text-muted-blue">
            Quản lý cài đặt cho các trang sản phẩm ({pageTypes.length} trang)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageTypes.map((pageType) => (
          <PageSettingsCard key={pageType} pageType={pageType} />
        ))}
      </div>
    </div>
  );
}

