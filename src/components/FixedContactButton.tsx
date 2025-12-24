"use client";

import { useState } from "react";
import {
  MessageOutlined,
  PhoneOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useHomepageSections,
  useHomepageSection,
} from "@/hooks/useHomepageSections";

export default function FixedContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sections = [] } = useHomepageSections();
  const footerSection = useHomepageSection("footer", sections);

  const content = footerSection?.content || {};
  const phone = (content.phone as string) || "+84123456789";
  const zaloContact = (content.zaloContact as string) || "";
  const chatUrl = (content.chatUrl as string) || "";

  const handlePhoneClick = () => {
    const phoneNumber = phone.replace(/\s/g, "").replace(/\+/g, "");
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleZaloClick = () => {
    if (!zaloContact) return;

    // Check if it's a URL or phone number
    if (zaloContact.startsWith("http")) {
      window.open(zaloContact, "_blank");
    } else {
      const zaloNumber = zaloContact.replace(/\s/g, "").replace(/\+/g, "");
      window.open(`https://zalo.me/${zaloNumber}`, "_blank");
    }
  };

  const handleChatClick = () => {
    if (chatUrl) {
      window.open(chatUrl, "_blank");
    } else {
      // Fallback to Zalo if no chat URL
      handleZaloClick();
    }
  };

  return (
    <>
      {/* Fixed Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-spirit-cyan to-secondary-cyan shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-midnight font-bold text-xl"
        aria-label="Liên hệ"
      >
        {isOpen ? (
          <CloseOutlined className="text-2xl !text-white" />
        ) : (
          <MessageOutlined className="text-2xl !text-white" />
        )}
      </button>

      {/* Contact Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed bottom-24 right-6 z-50 bg-moonlight border border-spirit-cyan/30 rounded-xl shadow-2xl overflow-hidden min-w-[200px] animate-fade-in">
            <div className="p-2">
              {phone && (
                <button
                  onClick={handlePhoneClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spirit-cyan/10 transition-colors text-ice-white group"
                >
                  <div className="w-10 h-10 rounded-full bg-spirit-cyan/20 flex items-center justify-center group-hover:bg-spirit-cyan/30 transition-colors">
                    <PhoneOutlined className="text-lg text-spirit-cyan" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-pure-white">
                      Gọi điện
                    </div>
                    <div className="text-xs text-muted-blue">{phone}</div>
                  </div>
                </button>
              )}

              {zaloContact && (
                <button
                  onClick={handleZaloClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spirit-cyan/10 transition-colors text-ice-white group mt-1"
                >
                  <div className="w-10 h-10 rounded-full bg-spirit-cyan/20 flex items-center justify-center group-hover:bg-spirit-cyan/30 transition-colors">
                    <svg
                      className="w-5 h-5 text-spirit-cyan"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97c1.31.61 2.75.97 4.29.97 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.35-3.81-.96l-.27-.15-2.92.86.86-2.92-.15-.27C5.35 14.68 5 13.38 5 12c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-pure-white">
                      Zalo
                    </div>
                    <div className="text-xs text-muted-blue">
                      {zaloContact.startsWith("http") ? "Mở Zalo" : zaloContact}
                    </div>
                  </div>
                </button>
              )}

              {chatUrl && (
                <button
                  onClick={handleChatClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spirit-cyan/10 transition-colors text-ice-white group mt-1"
                >
                  <div className="w-10 h-10 rounded-full bg-spirit-cyan/20 flex items-center justify-center group-hover:bg-spirit-cyan/30 transition-colors">
                    <MessageOutlined className="text-lg text-spirit-cyan" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-pure-white">
                      Chat
                    </div>
                    <div className="text-xs text-muted-blue">Mở chat</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
