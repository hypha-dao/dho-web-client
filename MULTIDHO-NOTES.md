# Development Features

## Multi-Tenancy Support
- Proposal lists/creation are close to supporting multi-tenant, hoping to wrap those up besides support for custom tokens
- Members list, treasury, profile and all new pages need to be updated to new queries
- Development and testing really need a dgraph instance with a full schema loaded which requires the contract to be seeded with initial data (we discussed this need Thursday)

## Proposal List/Detail Page
- Supports Multi-dho, besides alternate tokens (custom icon and names)
- Proposal list still missing mobile layout (banner and filter widget)
- Detail page not integrated with backend for staging, no functionality for comments
- (In progress) Voting via detail page in multi-tenant
- Handle case where detail page hash is in dfferent dho than one selected

## Proposal Creation
- Still missing custom mobile layout
- (In progress) Creating proposals in multi-dho, (custom token icon and names will still be missing)
- (In progress) Final details for multi-dho needed to support to save as draft
- Needs thorough testing

## Mobile Layouts
- Main layout for most pages is complete for mobile
- Proposal detail page mobile layout is complete
- Custom layout for proposal creation wizard not yet started
- Different views (logged in/out, not a member, etc) untested but should have some support
- Filtered list view for proposal list, member list, archetypes, etc

## Other Pages/Functionality
- Home Page (Beta)
  - Query for metrics
  - News source for widget, multi-dho

- Member List (Beta?)
  - Query via multi-dho
  - Custom voice % in multi-dho?
  - Mobile layout (filtered list)

- Profile Page (Alpha)
  - Update view for multi-dho
  - Assignments link to detail page

- Organizations Pages (Beta)
  - Treasury (new layout)
  - Archetypes (new query, new layout)
  - Badges (new query, new layout)

- Explore (Alpha?)
- Create DHO/Change DHO Settings (Beta)
- Search (Alpha?)
- Archetype List (Beta)
- Badge List (Beta)

## Unknowns
- Transition from Hypha DHO to Multi-Tenancy (how do old and new data mix)
- Bugs
- Treasury page with multi-dho, may need substantial updates


# Technical Details

### Multi-dao

1. The dao is 'selected' via the url. The `:dhoname` parameter is matched against the DAO name in the `dao-active.gql` query. This query retrieves the settings for the dao. This is called in the `DhoSelector.vue` component, which could either provide this data to the site via a vuex data store (does not currently, but probably makes sense) or via explicit props. Currently, there is no error page or redirect for failure to match a name, but there should be.

1. The settings selected in this query are not a complete set. We still need to store the names/icons for all tokens and any other dao specific settings. Those settings will be used to select images for navigation, text on the banners, the primary color of the page, and how the voting widget works. This all still needs to be done.

1. The `left-navigation.vue` component is the main navigation. It includes switching the DAO (which redirects to the same page with a new `:dhoname`) and navigating to the main pages: dashboard, proposals, members, and organization.

1.

### Queries

1. Found in the `query` folder. They are written in graph-ql against a dgraph backend. Make sure to use the dgraph docs for help writing and debugging. We use `vue-apollo` to query the data and reference it within the component. Typically, this is done on navigation or page components and passed as props to the other elements.

1. The `dao-` queries are specific to multi-dho. The others should be written similarly as needed to support multi-dho on other pages. This ensures that the dao is first queried, then relationships/edges that extend from that dao are selected to produce the result.

1. Use `GraphQL Playground` to test and develop queries. Work with @smontero to get endpoints.

1. The `GRAPHQL_URI` env variable is used to control the endpoint for vue-apollo to the typed queries.

1. The old site points to a different dgraph instance that should be deprecated once transitioned. This includes the `DGRAPH_URL` and `DGRAPH_ROOT` env variables.


### Proposal Creation Wizard

1. Initiated in the `ProposalCreate.vue` page, this allows proposals to be created via a multi-step form.

1. The steps are determined by a configuration stored in `src/pages/proposals/create/config.json` which determines the steps, the types of proposals and the fields needed for each, and the vue component to render the data into. (Note: I'm going to update this to multi-dho and clean it up as best I can for transition)

1. The form components mutate a vuex `proposal-draft` based on the user input.

1. The user can save the draft by clicking a button, or it is done automatically when the user navigates away from the creation wizard (not done yet).

1. Saving the proposal send an action to the blockchain to create the proposal.

