import React from 'react';
import {twMerge} from 'tailwind-merge';

interface ChipProps {
  label: string;
  isSelected: boolean;
  className?: string;
  onClick?: () => void;
}

const Chip = ({
  label,
  isSelected,
  className = '',
  onClick = () => {},
}: ChipProps) => {
  const baseClassName = 'cursor-pointer rounded-full px-6 py-2 select-none';
  const selectedClassName = `${isSelected ? 'bg-stone-900 text-white' : 'bg-neutral-200 text-neutral-400'}`;

  const chipClassName = twMerge(baseClassName, selectedClassName, className);

  return (
    <div className={chipClassName} onClick={onClick}>
      {label}
    </div>
  );
};

export default Chip;
