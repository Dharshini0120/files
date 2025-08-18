import { gql } from '@apollo/client';
import { useQueryWithLoader, useMutationWithLoader } from '@frontend/shared-utils';

export const GET_ALL_USERS_ENHANCED = gql`
  query ListUsers {
    listUsers(page: 1, limit: 10) {
      status
      message
      statusCode
      data
    }
  }
`;

export const CREATE_USER_ENHANCED = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

// Enhanced hooks with automatic loading
export const useGetAllUsersWithLoader = () => {
  return useQueryWithLoader(GET_ALL_USERS_ENHANCED, { 
    fetchPolicy: 'network-only' 
  });
};

export const useCreateUserWithLoader = () => {
  return useMutationWithLoader(CREATE_USER_ENHANCED);
};