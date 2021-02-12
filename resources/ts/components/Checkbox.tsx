import React from 'react';
import { IconType } from 'react-icons';
import { ImCheckmark } from 'react-icons/im';

type Props = {
  checkedicon?: IconType;
  uncheckedicon?: IconType;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox: React.FC<Props> = ({
  checked,
  className = '',
  wrapperClassName = '',
  checkedicon = ImCheckmark,
  uncheckedicon,
  ...props
}) => {
  const Icon = checked ? checkedicon : uncheckedicon;

  return (
    <span className={`relative h-5 leading-none ${wrapperClassName}`}>
      <input
        {...props}
        checked={checked}
        type="checkbox"
        onClick={(e) => e.stopPropagation()}
        className={`appearance-none inline-block w-5 h-5 rounded-full bg-white border-2 border-gray-400 checked:bg-gray-400 checked:border-transparent focus:outline-none ${className}`}
      />
      {Icon && (
        <Icon className="pointer-events-none absolute m-auto inset-x-0 inset-y-0 w-3 h-3 text-white" />
      )}
    </span>
  );
};
