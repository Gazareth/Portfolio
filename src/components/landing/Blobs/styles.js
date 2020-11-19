import styled from 'styled-components';
import detailsIllustration from 'assets/illustrations/details.svg';

export const BlobsWrapper = styled.div`
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
