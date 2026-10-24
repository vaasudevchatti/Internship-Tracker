import React from "react";

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    {...props}
  />
);
