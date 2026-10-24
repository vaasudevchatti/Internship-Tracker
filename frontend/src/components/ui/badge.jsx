import React from "react";
import clsx from "clsx";

export const Badge = ({ className = "", children }) => {
  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs font-semibold rounded text-white",
        className
      )}
    >
      {children}
    </span>
  );
};
