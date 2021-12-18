# Next Steps

1. Proposal Creation Wizard
    1. Complete support for `Assignment` type. The way to query periods via graphql is not defined for multi-dho yet. You should query the periods that (1) are part of the dao and (2) that in the future, up to a some number to allow the user to pick periods. You will need to update the query in `periods-upcoming.gql` to be similar to the `dao-` queries that query first for a dao then follow edges to the correct periods.
    1. Add the salary preview to `StepCompensation.vue` for both `Assignment` and `Role` types. Work with the backend team to determine the best way to calculate the values.
    1. (Optional) You may want to break `StepCompensation.vue` into subcomponents. There are lots of repeated patterns that can be cleaned up to make the code easier to read and modify.
    1. Add support for `Badges` and `Badge Creation` types.
    1. Add support for custom token icons saved via IPFS, with the details stored in dao settings document. Work with backend team to work out how icon data is stored on chain.
    1. (Quality of Life) Add popups when changing category or continuing a draft as that erased the current in progress creation.
    1. (Optional) Only allow drafts to be saved once a name is added? Then auto advance to step 2 when continuing draft.
    1. (Optional) Add support for multiple saved drafts?
    1. (Quality of Life) Add props to the `ProposalCreate.vue` page to allow the route to change on step changes. This would enable the back button to be used during the process.
    1. Enable the other categories (example Bridge, Expense) in `config.json` with limited `fields` based on their design. Work with the design team to figure out what fields are needed for each category. Most are simplified versions of existing types (for example, the 'Policy' category is just the `Payout` type without any of the token fields and can skip the compensation step). You can see how the 'Contribution' category skips the date step in the `config.json`
        - The `Bridge` type needs an updated query and to have the proposal values set based on the picked assignment.

1. Proposal Detail Page
    1. Test voting (and fix any issues)
    1. The final step of the proposal creation wizard is the same component as the one used for the detail page.
    1. Every supported category in the creation wizard should end with the appropriate detail page view.
    1. Add support for proposal `staging`.

1. Proposal List Page
    1. Update the query once able to -- (`dao-proposals-active.gql` should support the same types as `proposals-active.gql` basically, using the new data fields)
    1. Get the user's vote -- unfortunately it can't be queried as the graph currently exists because dgraph does not allow queries on dynamic types (cant do this: `... on Vote(filter: { vote_voter_n: { eq: "<username>" }}))`). Instead we get all the votes and look for a match, which is not ideal

# Development Features

## Multi-Tenancy Support
- Proposal lists/creation are close to supporting multi-tenant, hoping to wrap those up besides support for custom tokens
- Members list, treasury, profile and all new pages need to be updated to new queries
- Development and testing really need a dgraph instance with a full schema loaded which requires the contract to be seeded with initial data (this is still missing)
- Periods don't yet work in a multi-tenant environment as we cannot query them
- If the backend is moving away from hashes... anything in the v2 frontend using hashes may need to be updated.

## Proposal List/Detail Page
- Supports Multi-dho, besides alternate tokens (custom icon and names)
- Proposal list still missing mobile layout (banner and filter widget)
- Detail page not integrated with backend for staging, no functionality for comments
- (In progress) Voting via detail page in multi-tenant
- Handle case where detail page hash is in dfferent dho than one selected

## Proposal Creation
- Still missing custom mobile layout
- Contributions, roles working... assignments almost working (depends on period querying)
- Only 1 draft supported, no popups/warnings of data being overwritten
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

### Repository Setup

- This repository is built on top of `vue` v2 and `quasar` v1 (we are not yet using Quasar v2 or Vue v3).
- We use `vue-apollo` to run backend queries that hit a dgraph instance for retrieving data on the blockchain that has been replicated into the graph.
- Changes/transactions are sent to the backend and executed on the blockchain, then updates are replicated to the graph.
- The old version of the site heavily relied on `vuex` to maintain state. The updated multi-tenant version of the site uses vuex only in a few circumstances, instead relying on passing state down via props.
  - We use vuex for `account`, `ballots`, `dao`, and `proposals` (creation wizard).
  - This structure is not enforced directly, but via a few mechanisms.
  - Generally, we do apollo queries in either Navigation or Page components. Usually indicated by a capital letter at the beginning of the file name
  - All other components are 'pure' components whose state is generally only derived by props. In a few rare cases, some components (`profile-picture.vue` for example) will retrieve data from the backend in some way.
  - Using 'pure' components allows us to test them easily using `storybook` which is our main unit test and documentation framework.

### Multi-dao

1. The dao is 'selected' via the url. The `:dhoname` parameter is matched against the DAO name in the `dao-active.gql` query. This query retrieves the settings for the dao. This is called in the `DhoSelector.vue` component, which saves this data to the vuex `dao` store for other pages to use. If there is no dho match, the page should redirect to the old UI, but it does not do this currently.

1. The settings selected in this query are not a complete set. We still need to store the names/icons for all tokens and any other dao specific settings. Those settings will be used to select images for navigation, text on the banners, the primary color of the page, and how the voting widget works. This all still needs to be done.

1. The `MultiDhoLayout.vue` and its children (`left-navigation.vue`, etc) component is the main navigation. It includes switching the DAO (which redirects to the same page with a new `:dhoname`) and navigating to the main pages: dashboard, proposals, members, and organization. It also implements the right side navigation via the `profile-sidebar.vue` component.

### Queries

1. Found in the `query` folder. They are written in graph-ql against a dgraph backend. Make sure to use the dgraph docs for help writing and debugging. We use `vue-apollo` to query the data and reference it within the component. Typically, this is done on navigation or page components and passed as props to the other elements.

1. The `dao-` queries are specific to multi-dho. The others should be written similarly as needed to support multi-dho on other pages. This ensures that the dao is first queried, then relationships/edges that extend from that dao are selected to produce the result.

1. Use `GraphQL Playground` to test and develop queries. Work with @smontero to get endpoints.

1. The `GRAPHQL_URI` env variable is used to control the endpoint for vue-apollo to the typed queries. This hasn't been added to the the ENV file yet but should probably have a test and prod value.

1. The old site points to a different dgraph instance that should be deprecated once transitioned. This includes the `DGRAPH_URL` and `DGRAPH_ROOT` env variables.


### Proposal Creation Wizard

1. Initiated in the `ProposalCreate.vue` page, this allows proposals to be created via a multi-step form.

1. The steps are determined by a configuration stored in `src/pages/proposals/create/config.json` which determines the steps, the types of proposals and the fields needed for each, and the vue component to render the data into. (Note: I'm going to update this to multi-dho and clean it up as best I can for transition). Breakdown of the file:

    - It is a JSON file.
    - At the top level, contains 3 properties: `steps`, `fields`, and `options`.
    - The `steps` contain the names and order of the steps as displayed on the `creation-stepper.vue` component. Certain options may override values in the steps to hide/disable them.
      - Each step contains a `key`, `index`, `label`, and vue `component` name that is rendered when on that step.
    - The `fields` contain the fields that are expected to be set for a proposal. Certain options will have their own fields property which is merged into the top level list. This contains the full set of fields for a proposal type. Only fields present in this object are shown on the subsequent steps.
        - Each field contains a `key`, `label`, `description` and `type`
        - Certain fields are expected to be present depending on the field
    - The `options` are decoded by the `StepProposalType.vue` component to create a selection form for each. All the top level options have a set of sub-options. Many of the sub options also allow selection of a specific historical document (an assignment you held, a quest you started, the roles/archetypes, or the badges). Each of the `OptionsXXXX.vue` components handles a specific case when those are selected. These each allow a document reference to be selected. This reference may be used in the follow-up steps.
        - For example, the assignment category refers to a role and sets some values based on it

1. The form components mutate a vuex `proposals` based on the user input.

1. The user can save the draft by clicking a button. Only supports 1 draft currently but probably wouldn't be hard to expand it. Continuing a draft overwrites the current proposal progress. Saving a draft overwrites the current draft. The draft is not saved if the user navigates away (but should be simple to add).

1. Saving the proposal sends an action to the blockchain to create the proposal.

### Unit Testing

1. We use `storybook` for testing and documentation.
1. However, storybook can only be used to test 'pure' components (state is only determined by props).
1. In general, the website has been constructed to minimize the number of components that don't fit this category. These are usually layouts or pages, indicated by a capital letter at the beginning of the file name.
1. Each commit will automatically create storybook that can be accessed by anyone via `chromatic` -- the links can be accessed directly from github pull requests.
1. In addition to testing, chromatic includes javadoc comments in the output, providing a good documentation source as well.
