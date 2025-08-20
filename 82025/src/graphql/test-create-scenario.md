# Create Scenario Mutation Test

## Updated GraphQL Mutation

```graphql
mutation CreateScenarioV2($input: CreateScenarioVersionInput!) {
  createScenario(input: $input) {
    code
    message
    type
    data
  }
}
```

**Note:** Changed mutation name to `CreateScenarioV2` to bypass Apollo Client caching issues.

## Test Input

```javascript
{
  "input": {
    "name": "scenario",
    "questionnaire": {
      "nodes": [...],
      "edges": [...],
      "templateName": "My Template"
    },
    "facilities": ["689e14c15cef54587ec17a52", "689e14c15cef54587ec17a53"],
    "services": ["689e14c15cef54587ec17a63", "689e14c15cef54587ec17a65"]
  }
}
```

**Note:** The `questionnaire` object now only contains `nodes`, `edges`, and `templateName`. Facility types and services are NOT stored in the questionnaire - they are only sent as separate ID arrays.

## Expected Response

```javascript
{
  "data": {
    "createScenario": {
      "code": 200,
      "message": "ScenarioVersion created successfully",
      "type": "SUCCESS",
      "data": {
        "_id": "68a2be814d382e1edd131a4a",
        "name": "scenario",
        "questionnaire": {
          "key": "value"
        },
        "facilities": [
          "689e14c15cef54587ec17a52",
          "689e14c15cef54587ec17a53"
        ],
        "services": [
          "689e14c15cef54587ec17a63",
          "689e14c15cef54587ec17a65"
        ],
        "isDeleted": false,
        "createdAt": "2025-08-18T05:47:45.386Z",
        "updatedAt": "2025-08-18T05:47:45.386Z"
      }
    }
  }
}
```

## Key Changes Made

1. **Fixed GraphQL Schema Issue**: Removed subfield selection from `data` field since it's a `JSONObject` scalar type
2. **Updated TypeScript Interfaces**: Changed `data` type to `any` to match `JSONObject`
3. **Added Facility/Service ID Mapping**: Frontend now converts names to IDs before sending mutation
4. **Enhanced Logging**: Added detailed logging to show the created scenario data

## How It Works

1. User creates a questionnaire with facility types and services (by name)
2. Frontend queries `getAllFacilityTypes` and `getServiceLines` to get ID mappings
3. Helper functions convert names to IDs:
   - `getFacilityTypeIds()` converts facility type names to IDs
   - `getServiceIds()` converts service names to IDs
4. Questionnaire object is created with ONLY:
   - `nodes`: Array of question/section nodes
   - `edges`: Array of connections between nodes
   - `templateName`: Name of the template
5. Mutation is sent with:
   - Clean questionnaire object (no facility/service data)
   - Separate `facilities` array with IDs
   - Separate `services` array with IDs
6. Backend returns the created scenario with all data in the `data` field as a JSONObject

## Edit/View/Delete Integration

### Updated getScenarioById Query

```graphql
query GetScenarioById($scenarioId: ID!, $version: String) {
  getScenarioById(scenarioId: $scenarioId, version: $version) {
    _id
    scenario {
      _id
      name
    }
    version
    status
    isLatest
    facilities
    services
    questionnaire
    versions
  }
}
```

### Template Actions

1. **Edit**: Navigate to `/questionnaire-builder?scenarioId={id}&version={version}`
2. **View**: Navigate to `/questionnaire-builder?scenarioId={id}&version={version}&mode=view`
3. **Delete**: Call `deleteScenario` mutation with scenario ID

### URL Parameters for Edit Mode

- `scenarioId`: The scenario ID to edit
- `version`: The version to edit (defaults to "V1")
- `mode`: Optional mode parameter ("view" for read-only)

## Testing

To test this mutation, you can use the GraphQL playground with the exact query structure shown above.
