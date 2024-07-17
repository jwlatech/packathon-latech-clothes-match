import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {media, section} = cms;
  const {image, aspectMobile} = {...media};
  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <Image
            data={{
              altText: image?.imageMobile?.altText || image?.alt,
              url: image?.imageMobile?.src,
              width: image?.imageMobile?.width,
              height: image?.imageMobile?.height,
            }}
            aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
            crop={image?.cropMobile}
            width="88"
            loading="lazy"
          />
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
