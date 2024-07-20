import React, {useState} from 'react';
import GenderToggle from './GenderToggle';
import {ICustomCollection} from '~/sections/MatchExperience/interfaces';
import {Chip} from '../../common';

interface FirstStepMatchProps {
  collections: ICustomCollection[];
  handleSelectCollection: (collection: ICustomCollection) => void;
  isSelectedCollection: (collection: ICustomCollection) => boolean;
}

const FirstStepMatch = ({
  collections,
  handleSelectCollection,
  isSelectedCollection,
}: FirstStepMatchProps) => {
  const [selected, setSelected] = useState('Man');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <GenderToggle selected={selected} setSelected={setSelected} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center font-semibold gap-1">
          <span>Select the type of</span>
          <span>products you are looking for</span>
        </div>
        <div className="flex w-full gap-2 justify-center px-[36px]">
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
