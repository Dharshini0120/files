import { gql } from '@apollo/client';

export const GET_USERS_TEMPLATES_QUERY = gql`
  query UsersTemplates($facilities: [FacilityWithServicesInput!]!) {
    usersTemplates(facilities: $facilities) {
      scenarioVersions {
        _id
        scenario {
          _id
          name
          facilities
          services
        }
        version
        status
        isLatest
        facilities
        services
        questionnaire
        createdAt
      }
    }
  }
`;

// TypeScript interfaces
export interface FacilityWithServicesInput {
  facility_id: string;
  services: string[];
}

// Keep the old interfaces for backward compatibility
export interface FacilitiesInput {
  facility_id: string;
  services: string[];
}

export interface UserFacilityInput {
  facility_id: string;
  services: string[];
}

export interface FacilityInput {
  facility_id: string;
  services: string[];
}

export interface ScenarioVersion {
  _id: string;
  scenario: {
    _id: string;
    name: string;
    facilities: string[];
    services: string[];
  };
  version: string;
  status: string;
  isLatest: boolean;
  facilities: string[];
  services: string[];
  questionnaire: Record<string, any>;
  createdAt: string;
}

export interface GetUsersTemplatesResponse {
  scenarioVersions: ScenarioVersion[];
}

export interface GetUsersTemplatesData {
  usersTemplates: GetUsersTemplatesResponse;
}
