"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { ITimelineSection } from "@/lib/models/AboutPage";

interface TimelineSectionProps {
  content: ITimelineSection;
}

export default function TimelineSection({ content }: TimelineSectionProps) {
  const { isVisible, title, milestones } = content;

  if (!isVisible || milestones.length === 0) {
    return null;
  }

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  // Sort milestones by order
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 bg-hero-gradient-transparent5 relative">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-4">
            {title}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-spirit-cyan via-mystic to-spirit-cyan"></div>

          {/* Milestones */}
          <div className="space-y-12">
            {sortedMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-row`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-spirit-cyan border-4 border-midnight glow-cyan z-10"></div>

                  {/* Content */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven ? "md:pr-12 pl-20" : "md:pl-12 pl-20"
                    }`}
                  >
                    <div className="glass-card rounded-2xl p-6 border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group hover:scale-105 hover:glow-cyan">
                      {/* Year Badge */}
                      <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-spirit-cyan to-mystic text-midnight font-bold text-sm mb-4">
                        {milestone.year}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-pure-white mb-3 group-hover:text-spirit-cyan transition-colors">
                        {milestone.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-blue leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      {/* Image */}
                      {milestone.image && (
                        <div className="relative rounded-xl overflow-hidden border border-spirit-cyan/20 aspect-video">
                          {isExternalImage(milestone.image) ? (
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <Image
                              src={milestone.image}
                              alt={milestone.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

