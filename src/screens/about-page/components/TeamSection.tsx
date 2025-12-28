"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { ITeamSection } from "@/lib/models/AboutPage";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

interface TeamSectionProps {
  content: ITeamSection;
}

export default function TeamSection({ content }: TeamSectionProps) {
  const { title, subtitle, members } = content;

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  // Sort members by order
  const sortedMembers = [...members].sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 bg-hero-gradient-transparent5 relative">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-blue leading-relaxed">{subtitle}</p>
          )}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group hover:scale-105 hover:glow-cyan"
            >
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-spirit-cyan/30 group-hover:border-spirit-cyan/60 transition-all duration-300">
                {isExternalImage(member.avatar) ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-pure-white mb-2 group-hover:text-spirit-cyan transition-colors">
                  {member.name}
                </h3>
                <p className="text-golden font-medium mb-4">{member.role}</p>
                <p className="text-sm text-muted-blue leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                {member.socialLinks && (
                  <div className="flex justify-center gap-4">
                    {member.socialLinks.facebook && (
                      <a
                        href={member.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ice-white hover:text-spirit-cyan transition-colors text-xl"
                      >
                        <FacebookOutlined />
                      </a>
                    )}
                    {member.socialLinks.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ice-white hover:text-spirit-cyan transition-colors text-xl"
                      >
                        <InstagramOutlined />
                      </a>
                    )}
                    {member.socialLinks.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ice-white hover:text-spirit-cyan transition-colors text-xl"
                      >
                        <LinkedinOutlined />
                      </a>
                    )}
                    {member.socialLinks.email && (
                      <a
                        href={`mailto:${member.socialLinks.email}`}
                        className="text-ice-white hover:text-spirit-cyan transition-colors text-xl"
                      >
                        <MailOutlined />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

