import React from 'react';
import { ImCheckmark } from 'react-icons/im';

type Props = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const Checkbox: React.FC<Props> = (props) => {
  return (
    <span className="relative order-first h-5 leading-none mr-3 self-center">
      <input
        {...props}
        type="checkbox"
        onClick={(e) => e.stopPropagation()}
        className="order-first appearance-none inline-block w-5 h-5 rounded-full bg-white border-2 border-gray-400 checked:bg-blue-500 checked:border-transparent focus:outline-none"
      />
      {props.checked && (
        <ImCheckmark className="pointer-events-none absolute m-auto inset-x-0 inset-y-0 w-3 h-3 text-white" />
      )}
    </span>
  );
};
