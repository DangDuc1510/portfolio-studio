"use client";
import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Tạo sản phẩm
        </h1>
        <p className="text-muted-blue">Thêm sản phẩm mới vào danh mục</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <ProductForm />
      </div>
    </div>
  );
}

