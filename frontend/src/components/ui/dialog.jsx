import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => onOpenChange(false)}
        ></div>
      )}

      {/* DIALOG CONTAINER */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl animate-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export const DialogTrigger = ({ asChild, onClick, children }) => {
  return React.cloneElement(children, {
    onClick: (e) => {
      if (children.props.onClick) children.props.onClick(e);
      if (onClick) onClick(e);
    },
  });
};

export const DialogContent = ({ children }) => <>{children}</>;

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);
