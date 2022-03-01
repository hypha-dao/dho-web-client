export const searchDhos = async function ({ commit, state }, { search }) {
  try {
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          {
            icon: 'far fa-paper-plane',
            title: 'Title',
            type: 'type',
            tags: [
              {
                color: 'white',
                label: 'stagin',
                text: 'red',
                outline: false
              }
            ]
          },
          {
            icon: 'far fa-paper-plane',
            title: 'Title 2',
            type: 'type',
            tags: [
              {
                color: 'white',
                label: 'stagin',
                text: 'red',
                outline: false
              }
            ]
          }
        )
      }, 250)
    })
    console.log({ search, data })
    return data
  } catch (error) {
    console.log(error)
  }
}
