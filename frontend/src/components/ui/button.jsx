import React from "react";
import clsx from "clsx";

export const Button = ({ className, variant = "default", ...props }) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
};
