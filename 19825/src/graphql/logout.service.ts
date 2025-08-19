import { gql } from '@apollo/client';

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      status
      message
      statusCode
      data
      error
    }
  }
`;
