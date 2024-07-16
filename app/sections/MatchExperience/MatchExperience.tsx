import {Container} from '~/components/Container';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  return (
    <Container container={cms.container}>
      <div>Match Experience</div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
