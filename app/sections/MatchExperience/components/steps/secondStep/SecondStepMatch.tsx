import React from 'react';
import {Chip} from '../../common';
import {
  IfilterCollection,
  IfilterCollectionValue,
} from '~/sections/MatchExperience';

interface SecondStepMatchProps {
  filtersByCollection: IfilterCollection[];
  isSelectedFilter: (
    filterCollection: string,
    value: string,
  ) => IfilterCollectionValue | undefined;
  handleSelectedFilterCollectionValue: (
    filter: IfilterCollection,
    value: string,
  ) => void;
}

const SecondStepMatch = ({
  filtersByCollection,
  isSelectedFilter,
  handleSelectedFilterCollectionValue,
}: SecondStepMatchProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center font-semibold gap-1">
          <span>Let's choose the perferct size for you!</span>
        </div>
        <div className="flex flex-col w-full gap-4 justify-center">
          {filtersByCollection.map((filter, index) => (
            <div className="flex flex-col gap-2" key={filter.title}>
              <div className="flex w-full items-center justify-center">
                <p className="font-semibold">{filter.collectionName}</p>
              </div>
              <div className="flex gap-2">
                {filter.values.map((value, index) => (
                  <Chip
                    label={value}
                    isSelected={!!isSelectedFilter(filter.collectionName, value)}
                    key={index}
                    onClick={() =>
                      handleSelectedFilterCollectionValue(filter, value)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondStepMatch;
