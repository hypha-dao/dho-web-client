import * as dotenv from 'dotenv'
import { CodegenConfig } from '@graphql-codegen/cli'

dotenv.config({ path: __dirname + '/.env' })

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_URI,
  documents: ['src/**/*.gql'],
  generates: {
    './src/generated/gql.ts': {
      config: {
        useTypeImports: true
      },
      plugins: [
        {
          add: {
            content: '/* eslint-disable */'
          }
        },
        'typescript',
        'typescript-operations',
        'typescript-vue-apollo-smart-ops'
      ]
    }
  },
  config: {
    contextType: 'Context',
    strictScalars: true,
    scalars: {
      DateTime: 'Date',
      Int64: 'BigInt'
    }
  }
}

export default config
