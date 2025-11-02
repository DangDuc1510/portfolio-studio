"use client";
import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Create Product</h1>
        <p className="text-gray-400">Add a new product to your catalog</p>
      </div>

      <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <ProductForm />
      </div>
    </div>
  );
}

