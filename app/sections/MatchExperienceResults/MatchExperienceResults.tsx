import {Container} from '~/components/Container';

import {Schema} from './MatchExperienceResults.schema';
import type {MatchExperienceResultsCms} from './MatchExperienceResults.types';

export function MatchExperienceResults({
  cms,
}: {
  cms: MatchExperienceResultsCms;
}) {
  return (
    <Container container={cms.container}>
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-5 text-center">
          <div>
            <h4>Recommended Matches</h4>
          </div>
          <div>
            <p>
              All the products have been specially selected for you, and the
              best part? They`re in your size!
            </p>
          </div>
          <div
            id="recommendedProducts"
            className="flex flex-row overflow-x-auto text-left"
          >
            {Array.from({length: 3}).map((_, index) => (
              <div key={index} className="ml-[16px] flex flex-col ">
                <div className="h-[204px] w-[151px] rounded-[20px] bg-red-500"></div>
                <div className="mt-[12px]">
                  <span className="font-bold">Product Name</span>
                </div>
                <div className="mt-[2px]">
                  <span>$50</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-center">
          <div className="text-center">
            <h4>Your match selection</h4>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-5">
            {Array.from({length: 9}).map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="h-[204px] w-[141px] rounded-[20px] bg-red-500"></div>
                <div className="mt-[12px]">
                  <span className="font-bold">Product Name</span>
                </div>
                <div className="mt-[2px]">
                  <span>$50</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

MatchExperienceResults.displayName = 'MatchExperienceResults';
MatchExperienceResults.Schema = Schema;
