"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { IValuesSection } from "@/lib/models/AboutPage";
import {
  StarOutlined,
  RocketOutlined,
  HeartOutlined,
  TeamOutlined,
  BulbOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

interface ValuesSectionProps {
  content: IValuesSection;
}

// Icon mapping - có thể mở rộng
const iconMap: Record<string, React.ReactNode> = {
  star: <StarOutlined className="text-5xl" />,
  rocket: <RocketOutlined className="text-5xl" />,
  heart: <HeartOutlined className="text-5xl" />,
  team: <TeamOutlined className="text-5xl" />,
  bulb: <BulbOutlined className="text-5xl" />,
  trophy: <TrophyOutlined className="text-5xl" />,
};

export default function ValuesSection({ content }: ValuesSectionProps) {
  const { title, subtitle, values } = content;

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  // Sort values by order
  const sortedValues = [...values].sort((a, b) => a.order - b.order);

  // Get icon component or image
  const getIcon = (iconValue: string) => {
    // Check if it's a predefined icon key
    if (iconMap[iconValue]) {
      return iconMap[iconValue];
    }

    // Check if it's an image URL
    if (iconValue.startsWith("http") || iconValue.startsWith("/")) {
      return isExternalImage(iconValue) ? (
        <img
          src={iconValue}
          alt="Value icon"
          className="w-16 h-16 object-contain"
        />
      ) : (
        <div className="relative w-16 h-16">
          <Image src={iconValue} alt="Value icon" fill className="object-contain" />
        </div>
      );
    }

    // Default icon
    return <StarOutlined className="text-5xl" />;
  };

  return (
    <section className="py-20 bg-section-gradient relative">
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

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedValues.map((value, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group hover:scale-105 hover:glow-cyan text-center"
            >
              {/* Icon */}
              <div className="mb-6 text-spirit-cyan group-hover:text-golden transition-colors duration-300 flex justify-center">
                {getIcon(value.icon)}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-pure-white mb-4 group-hover:text-spirit-cyan transition-colors">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-muted-blue leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

