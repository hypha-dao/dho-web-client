const fetch = require('cross-fetch')
const fs = require('fs')

fetch('https://alpha-st.tekit.io/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
}).then(result => result.json())
  .then(result => {
    const possibleTypes = {}

    result.data.__schema.types.forEach(supertype => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] =
          supertype.possibleTypes.map(subtype => subtype.name)
      }
    })

    fs.writeFile('./src/apollo/possibleTypes.json', JSON.stringify(result.data), err => {
      if (err) {
        console.error('Error writing possibleTypes.json', err) // eslint-disable-line no-console
      } else {
        // console.info('Fragment types successfully extracted!')
      }
    })
  })
