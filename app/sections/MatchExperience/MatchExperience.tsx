import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {media, section} = cms;
  const {image, yesImage, noImage, aspectMobile} = {...media};
  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }`}
      >
        <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-5">
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
          <div className="w-full grow px-[36px]">
            <div className="size-full rounded-[24px] bg-blue-500"></div>
          </div>
          <div>
            <h4>Nombre del producto</h4>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <Image
              data={{
                altText: noImage?.imageMobile?.altText || noImage?.alt,
                url: noImage?.imageMobile?.src,
                width: noImage?.imageMobile?.width,
                height: noImage?.imageMobile?.height,
              }}
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={noImage?.cropMobile}
              width="66"
              loading="lazy"
            />
            <Image
              data={{
                altText: yesImage?.imageMobile?.altText || yesImage?.alt,
                url: yesImage?.imageMobile?.src,
                width: yesImage?.imageMobile?.width,
                height: yesImage?.imageMobile?.height,
              }}
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={yesImage?.cropMobile}
              width="66"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
