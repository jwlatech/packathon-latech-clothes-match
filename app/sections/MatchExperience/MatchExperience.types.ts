import type {ProductCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

export interface MatchExperienceCms {
  container: ContainerSettings;
  preselects: {
    product: ProductCms;
  }[];
}
