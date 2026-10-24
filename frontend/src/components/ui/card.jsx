import React from "react";

export const Card = ({ className = "", ...props }) => (
  <div
    className={`rounded-lg border bg-white shadow-sm p-4 ${className}`}
    {...props}
  />
);

export const CardHeader = ({ className = "", ...props }) => (
  <div className={`mb-2 ${className}`} {...props} />
);

export const CardTitle = ({ className = "", children, ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props}>
    {children || <span className="sr-only">Title</span>}
  </h2>
);

export const CardDescription = ({ className = "", ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div className={className} {...props} />
);
