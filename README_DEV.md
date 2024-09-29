# Hypha DHO Web Client - Developer Guide

This guide will help you set up and run the Hypha DHO Web Client project locally, as well as deploy it to a remote server.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting up the Environment](#setting-up-the-environment)
3. [Running the Project Locally](#running-the-project-locally)
4. [Deploying to a Remote Server](#deploying-to-a-remote-server)

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (version 18 or higher)
- Yarn package manager
- Git

## Setting up the Environment

1. Clone the repository:
   ```
   git clone https://github.com/hypha-dao/dho-web-client.git
   cd dho-web-client
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Create a `.env` file in the root directory of the project. You can use the following template and replace the values with your own:

   ```
   APP_NAME=Hypha DHO
   NETWORK_CHAIN_ID=your_network_chain_id
   DAO_CONTRACT=your_dao_contract
   HYPHA_CONTRACT=your_hypha_contract
   ACCOUNT_API_URL=your_account_api_url
   ACCOUNT_API_KEY=your_account_api_key
   BLOCKCHAIN_EXPLORER=your_blockchain_explorer_url
   PPP_ENV=your_ppp_env
   SENTRY_DSN=your_sentry_dsn
   DGRAPH_URL=your_dgraph_url
   BLOCKCHAIN_ENDPOINTS=your_blockchain_endpoints
   GRAPHQL_URI=your_graphql_uri
   ELASTIC_SEARCH_URL=your_elastic_search_url
   ELASTIC_SEARCH_API_KEY=your_elastic_search_api_key
   IPFS_URL=your_ipfs_url
   IPFS_PROJECT_ID=your_ipfs_project_id
   IPFS_PROJECT_SECRET=your_ipfs_project_secret
   IPFS_GATEWAY=your_ipfs_gateway
   HYPHA_TOKEN_SALES_ENCODE_KEY=your_hypha_token_sales_encode_key
   HYPHA_TOKEN_SALES_URL=your_hypha_token_sales_url
   HYPHA_TOKEN_SALES_API_URL=your_hypha_token_sales_api_url
   HYPHA_TOKEN_SALES_RPC_URL=your_hypha_token_sales_rpc_url
   ROOT_DAO_ID=your_root_dao_id
   ROOT_DAO_SLUG=your_root_dao_slug
   HEALTH_ENDPOINT=your_health_endpoint
   CAPTCHA_PUBLIC_KEY=your_captcha_public_key
   CAPTCHA_HOST=your_captcha_host
   CAPTCHA_NETWORK=your_captcha_network
   LOGIN_CONTRACT=your_login_contract
   JOIN_CONTRACT=your_join_contract
   JOIN_URI=your_join_uri
   ```

   You can find the list of required environment variables in the `quasar.conf.js` file:

   ```javascript:quasar.conf.js
   startLine: 62
   endLine: 90
   ```

## Running the Project Locally

1. To run the project in development mode, use the following command:
   ```
   yarn dev
   ```

   This command is defined in the `package.json` file:

   ```json:package.json
   startLine: 9
   endLine: 9
   ```

2. To run the project with EOS testnet configuration:
   ```
   yarn dev:eos
   ```

   This command is defined in the `package.json` file:

   ```json:package.json
   startLine: 10
   endLine: 10
   ```

3. To run the project with Telos mainnet configuration:
   ```
   yarn prod:telos
   ```

   This command is defined in the `package.json` file:

   ```json:package.json
   startLine: 11
   endLine: 11
   ```

4. To run the project with EOS mainnet configuration:
   ```
   yarn prod:eos
   ```

   This command is defined in the `package.json` file:

   ```json:package.json
   startLine: 12
   endLine: 12
   ```

The development server will start, and you can access the application in your browser at `http://localhost:8080` (or the port specified by the Quasar CLI).

## Deploying to a Remote Server

The project uses GitHub Actions for continuous integration and deployment. The deployment process is defined in the workflow files located in the `.github/workflows/` directory.

1. For deploying to the development environment:
   ```yaml:.github/workflows/deploy-dev.yml
   startLine: 1
   endLine: 87
   ```

2. For deploying to the production environment:
   ```yaml:.github/workflows/deploy-prod.yml
   startLine: 1
   endLine: 73
   ```

3. For deploying to the EOS mainnet:
   ```yaml:.github/workflows/deploy-eos-prod.yml
   startLine: 1
   endLine: 94
   ```

To deploy the application:

1. Ensure that all your changes are committed and pushed to the appropriate branch (e.g., `develop` for development, `master` for production).

2. The GitHub Actions workflow will automatically trigger based on the branch you push to.

3. The workflow will build the application, run tests, and deploy it to the specified AWS S3 bucket and invalidate the CloudFront distribution.

4. Make sure you have the necessary AWS credentials and secrets set up in your GitHub repository settings.

For manual deployment, you can build the application using:
