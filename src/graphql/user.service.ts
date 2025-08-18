import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query ListUsers {
  listUsers(page: 1, limit: 10) {
    status
    message
    statusCode
    data
  }
}
`;


export const GET_ALL_FACILITY_TYPES = gql`
  query GetAllFacilityTypes {
    getAllFacilityTypes {
      status
      message
      statusCode
      data 
      error 
    }
  }
`;

export const GET_SERVICE_LINES = gql`
  query GetServiceLines {
    getServiceLines {
      status
      message
      statusCode
      data
      error
    }
  }
`;



export const CREATE_USER_MUTATION = gql`
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

export const UPDATE_USER_STATUS_MUTATION = gql`
  mutation UpdateUserStatus($input: UserStatusInput!) {
    UpdateUserStatus(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      status
      message
      statusCode
      data
      error
    }
  }
`;
