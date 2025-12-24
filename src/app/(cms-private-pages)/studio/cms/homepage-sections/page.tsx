"use client";
import Link from "next/link";
import {
  HomepageSection,
  useHomepageSections,
  useDeleteHomepageSection,
} from "@/hooks/useHomepageSections";
import { PlusOutlined } from "@ant-design/icons";
import HomepageSectionCard from "./components/HomepageSectionCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function HomepageSectionsListPage() {
  const { data: sections = [], isLoading } = useHomepageSections();
  const deleteSection = useDeleteHomepageSection();

  const handleDelete = async (id: string, sectionName: string) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa section "${sectionName}"? Hành động này không thể hoàn tác.`
      )
    ) {
      try {
        await deleteSection.mutateAsync(id);
      } catch (error: unknown) {
        console.error("Failed to delete section:", error);
        let errorMessage = "Không thể xóa section";
        if (error && typeof error === "object") {
          const err = error as {
            response?: { data?: { error?: string; message?: string } };
            message?: string;
          };
          errorMessage =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            errorMessage;
        }
        alert(errorMessage);
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải danh sách nội dung trang chủ..." fullScreen={false} />;
  }

  return (
    <div className="text-ice-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-pure-white">
            Nội dung trang chủ
          </h1>
          <p className="text-muted-blue">
            Quản lý các khối nội dung trang chủ ({sections.length} mục)
          </p>
        </div>
        <Link
          href="/studio/cms/homepage-sections/create"
          className="flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          <PlusOutlined />
          <span>Tạo Section</span>
        </Link>
      </div>

      {sections.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-spirit-cyan/20 text-center">
          <p className="text-muted-blue text-lg mb-6">Không tìm thấy section</p>
          <Link
            href="/studio/cms/homepage-sections/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
          >
            <PlusOutlined />
            <span>Tạo section đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section: HomepageSection) => (
            <HomepageSectionCard
              key={section._id}
              section={section}
              onDelete={handleDelete}
              isDeleting={deleteSection.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
