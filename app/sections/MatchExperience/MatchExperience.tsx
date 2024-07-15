import {Container} from '~/components/Container';

import type {MatchExperienceCms} from './MatchExperience.types';

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {preselects} = cms;

  return (
    <Container container={cms.container}>
      <div>Match Experience</div>
    </Container>
  );
}
