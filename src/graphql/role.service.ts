import { gql } from '@apollo/client';

export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    getAllRoles {
      status
      message
      statusCode
      data
      error
    }
  }
 `;

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: CreateRolesInput!) {
    createRole(input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($id: String!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id) {
      status
      message
      statusCode
      data
      error
    }
  }
`;

export const GET_ALL_MODULES = gql`
  query GetAllModules {
    getAllModules {
      status
      message
      statusCode
      data
      error
    }
  }
`;
