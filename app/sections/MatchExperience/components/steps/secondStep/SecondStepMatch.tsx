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
    <div className="flex flex-col gap-8 max-h-[500px] scrollbar-hide">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center font-semibold gap-1">
          <span>Let's choose the perfect size for you!</span>
        </div>
        <div className="flex flex-col w-full gap-2 justify-center">
          {filtersByCollection.map((filter, index) => (
            <div className="flex flex-col gap-1 justify-center items-center" key={filter.title}>
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
