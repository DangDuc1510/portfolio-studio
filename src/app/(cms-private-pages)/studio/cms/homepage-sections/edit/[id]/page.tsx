"use client";
import { useParams } from "next/navigation";
import HomepageSectionForm from "../../components/HomepageSectionForm";

export default function EditHomepageSectionPage() {
  const params = useParams();
  const sectionId = params.id as string;

  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Chỉnh sửa Section
        </h1>
        <p className="text-muted-blue">
          Cập nhật nội dung section trang chủ
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <HomepageSectionForm sectionId={sectionId} />
      </div>
    </div>
  );
}

