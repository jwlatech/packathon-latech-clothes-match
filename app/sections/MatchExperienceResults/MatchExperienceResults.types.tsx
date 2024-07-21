import type {Crop, ImageCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

interface Image {
  alt: string;
  imageDesktop: ImageCms;
  imageMobile: ImageCms;
  cropDesktop: Crop;
  cropMobile: Crop;
}

interface Icons {
  aspectDesktop: string;
  aspectMobile: string;
  fill: boolean;
  image: Image;
  nonIcon: Image;
  yesIcon: Image;
}

export interface MatchExperienceResultsCms {
  container: ContainerSettings;
  title: string;
  icons: Icons;
}
