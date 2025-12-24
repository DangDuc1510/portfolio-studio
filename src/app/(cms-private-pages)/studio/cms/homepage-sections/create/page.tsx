"use client";
import CreateHomepageSectionForm from "../components/CreateHomepageSectionForm";

export default function CreateHomepageSectionPage() {
  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Tạo Section Mới
        </h1>
        <p className="text-muted-blue">
          Thêm section mới để quản lý nội dung trang chủ
        </p>
      </div>
      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <CreateHomepageSectionForm />
      </div>
    </div>
  );
}
