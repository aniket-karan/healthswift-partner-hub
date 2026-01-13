import { ReactNode } from "react";

interface PortalLayoutProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-md",
  md: "max-w-2xl", 
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export const PortalLayout = ({ children, maxWidth = "xl" }: PortalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} px-4 sm:px-6 lg:px-8 py-6 lg:py-10`}>
        {children}
      </div>
    </div>
  );
};
