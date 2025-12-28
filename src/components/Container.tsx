import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  padding?: boolean | "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-[1500px]",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-2 sm:px-4",
  md: "px-4 sm:px-6",
  lg: "px-4 sm:px-6 lg:px-8",
};

export default function Container({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "lg",
}: ContainerProps) {
  const maxWidthClass = maxWidthClasses[maxWidth];
  const paddingClass =
    padding === true
      ? paddingClasses.lg
      : padding === false
      ? paddingClasses.none
      : paddingClasses[padding];

  return (
    <div
      className={`${maxWidthClass} mx-auto w-full ${paddingClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
