import React from "react";

const collectSelectItems = (children) => {
  const items = [];
  let placeholder = "Select...";

  React.Children.forEach(children, (child) => {
    if (!child) return;

    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (item?.type === SelectItem) {
          items.push(item);
        }
      });
    }

    if (child.type === SelectTrigger) {
      React.Children.forEach(child.props.children, (triggerChild) => {
        if (triggerChild?.type === SelectValue && triggerChild.props?.placeholder) {
          placeholder = triggerChild.props.placeholder;
        }
      });
    }
  });

  return { items, placeholder };
};

export const Select = ({ value, onValueChange, children }) => {
  const { items, placeholder } = collectSelectItems(children);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300 bg-white"
      >
        <option value="">{placeholder}</option>
        {items}
      </select>
    </div>
  );
};

export const SelectTrigger = ({ children }) => children;
export const SelectContent = ({ children }) => children;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
export const SelectValue = ({ placeholder }) => null;
