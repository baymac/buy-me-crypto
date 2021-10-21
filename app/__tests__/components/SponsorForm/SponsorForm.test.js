import React from 'react';
import { render } from 'test-utils';
import SponsorForm from '../../../components/SponsorForm/SponsorForm';

describe('Sponsor Form', () => {
  // eslint-disable-next-line jest/expect-expect
  it('is form accesible', () => {
    render(
      <SponsorForm
        creatorName="Parichay"
        creatorId="xyz"
        fanId="abc"
        isDisabled={false}
      />
    );
    // TBD
  });
});
