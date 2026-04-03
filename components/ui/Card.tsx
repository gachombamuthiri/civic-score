import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: string;
  footer?: React.ReactNode;
}

export function Card({ children, header, footer, className = "", ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`} {...props}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">{header}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}
