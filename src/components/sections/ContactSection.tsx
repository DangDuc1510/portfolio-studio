"use client";

import { useState, useCallback } from "react";
import { Button, message } from "antd";
import { createCustomer } from "@/lib/api";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        await createCustomer(formData);
        message.success("Your inquiry has been submitted successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } catch (error) {
        console.error("Failed to submit inquiry", error);
        message.error("Failed to submit inquiry. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  return (
    <section className="py-20 bg-gradient-to-br from-[#343434] to-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-300">
                Have a project in mind? We&apos;d love to hear from you. Send us a
                message and we&apos;ll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#FFDD00] rounded-lg flex-shrink-0">
                  <MailOutlined className="text-[#1C1C1C] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:info@portfoliostudio.com"
                    className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                  >
                    info@portfoliostudio.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#FFDD00] rounded-lg flex-shrink-0">
                  <PhoneOutlined className="text-[#1C1C1C] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#FFDD00] rounded-lg flex-shrink-0">
                  <EnvironmentOutlined className="text-[#1C1C1C] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Address</h3>
                  <p className="text-gray-400">
                    123 Studio Street, City, Country
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] rounded-2xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent transition-all"
                  placeholder="+1 (234) 567-890"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SendOutlined />}
                className="w-full bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] !text-[#1C1C1C] border-none font-semibold h-12 rounded-xl hover:shadow-lg hover:scale-105 transition-all [&_.anticon]:text-[#1C1C1C] [&_.ant-btn-loading-icon]:text-[#1C1C1C]"
              >
                <span className="text-[#1C1C1C]">Send Message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
