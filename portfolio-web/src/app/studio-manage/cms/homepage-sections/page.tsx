"use client";
import Link from "next/link";
import {
  useHomepageSections,
  HomepageSection,
} from "./hooks/useHomepageSections";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

export default function HomepageSectionsListPage() {
  const { data: sections = [], isLoading } = useHomepageSections();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Homepage Sections
        </h1>
        <p className="text-gray-400">
          Manage your homepage content sections ({sections.length} sections)
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg">No sections found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section: HomepageSection) => (
            <div
              key={section.id}
              className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {section.sectionName}
                  </h3>
                  <div className="flex items-center gap-2">
                    {section.isVisible ? (
                      <>
                        <EyeOutlined className="text-green-400" />
                        <span className="text-green-400 text-sm">Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeInvisibleOutlined className="text-gray-500" />
                        <span className="text-gray-500 text-sm">Hidden</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Content Preview:</p>
                <div className="bg-[#2C2C2C] border border-white/10 rounded-lg p-3 max-h-24 overflow-y-auto">
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap">
                    {JSON.stringify(section.content, null, 2).slice(0, 150)}
                    {JSON.stringify(section.content, null, 2).length > 150 && "..."}
                  </pre>
                </div>
              </div>

              <Link
                href={`/studio-manage/cms/homepage-sections/edit/${section.id}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-lg transition-all border border-white/10"
              >
                <EditOutlined />
                <span>Edit Section</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
