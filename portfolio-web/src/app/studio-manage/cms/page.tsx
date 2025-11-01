"use client";
import Link from "next/link";

export default function CmsDashboard() {
  const basePath = "/studio-manage/cms";

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Welcome to CMS Dashboard
      </h1>
      <p className="mb-6 text-gray-300">
        Select an option from the navigation to manage content:
      </p>
    </div>
  );
}
