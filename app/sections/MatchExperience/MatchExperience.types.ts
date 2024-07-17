import type {Crop, ImageCms, ProductCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

interface Image {
  alt: string;
  imageDesktop: ImageCms;
  imageMobile: ImageCms;
  cropDesktop: Crop;
  cropMobile: Crop;
}

interface Media {
  aspectDesktop: string;
  aspectMobile: string;
  fill: boolean;
  image: Image;
  yesImage: Image;
  noImage: Image;
}

interface Section {
  aboveTheFold: boolean;
  fullBleed: boolean;
  fullWidth: boolean;
  verticalPadding: boolean;
}

export interface MatchExperienceCms {
  container: ContainerSettings;
  media: Media;
  section: Section;
  products: {
    product: ProductCms;
  }[];
}
