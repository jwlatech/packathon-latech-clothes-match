import React, {useState} from 'react';
import GenderToggle from './GenderToggle';
import {ICustomCollection} from '~/sections/MatchExperience/interfaces';
import {Chip} from '../../common';

interface FirstStepMatchProps {
  collections: ICustomCollection[];
  handleSelectCollection: (collection: ICustomCollection) => void;
  isSelectedCollection: (collection: ICustomCollection) => boolean;
  selectedGender: string;
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>;
}

const FirstStepMatch = ({
  collections,
  handleSelectCollection,
  isSelectedCollection,
  selectedGender,
  setSelectedGender,
}: FirstStepMatchProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <GenderToggle selected={selectedGender} setSelected={setSelectedGender} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center font-semibold gap-1">
          <span>Select the type of</span>
          <span>products you are looking for</span>
        </div>
        <div className="flex w-full gap-2 justify-center px-[36px] flex-wrap">
          {collections.map((collection, index) => (
            <Chip
              label={collection.title}
              isSelected={isSelectedCollection(collection)}
              key={collection.title}
              onClick={() => handleSelectCollection(collection)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirstStepMatch;
