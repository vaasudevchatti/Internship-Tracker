import React from "react";

export function Tabs({ defaultValue, children }) {
  const [value, setValue] = React.useState(defaultValue);

  // Pass value + onValueChange to all nested children
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext();

export function TabsList({ children, className = "" }) {
  return <div className={`flex gap-2 mb-4 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const { value: active, setValue } = React.useContext(TabsContext);

  const isActive = active === value;

  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 text-sm rounded border 
        ${isActive ? "bg-blue-600 text-white" : "bg-gray-100"}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { value: active } = React.useContext(TabsContext);

  if (value !== active) return null;

  return <div className="mt-4">{children}</div>;
}
