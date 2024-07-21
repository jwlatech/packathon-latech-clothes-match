import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GenderToggleProps {
  selected: string;
  setSelected: (value: string) => void;
}

const GenderToggle = ({ selected, setSelected }: GenderToggleProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center w-48 h-12 bg-[#323232] rounded-full shadow-inner px-1 pb-[2px] pt-[1px]">
        <motion.div
          className="absolute w-[calc(50%-4px)] h-[85%] flex items-center justify-center font-semibold bg-white rounded-full select-none"
          initial={false}
          animate={{ x: selected === 'Men' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >{selected}</motion.div>
        <button
          className={`flex-1 h-full flex items-center justify-center ${
            selected === 'Men' ? 'text-[#323232]' : 'text-white'
          }`}
          onClick={() => setSelected('Men')}
        >
          Men
        </button>
        <button
          className={`flex-1 h-full flex items-center justify-center ${
            selected === 'Women' ? 'text-[#323232]' : 'text-white'
          }`}
          onClick={() => setSelected('Women')}
        >
          Women
        </button>
      </div>
    </div>
  );
};

export default GenderToggle;
