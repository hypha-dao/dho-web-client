export const getValueFromDocument = (document, contentGroup, key) => {
  const data = document.content_groups.find(cg => cg.contents.some(c => c.label === 'content_group_label' && c.value === contentGroup))
  if (data && data.contents.length) {
    const obj = data && data.contents.find(c => c.label === key)
    if (obj && obj.type === 'int64') {
      return parseInt(obj.value)
    }
    return obj && obj.value
  }
  return null
}

// TODO change contentGroup1/2 to an array
export const getValueFromDocumentFilters = (document, contentGroup1, contentGroup2, key) => {
  const data = document.content_groups.find(cg => cg.contents.some(c => c.label === contentGroup1.label && c.value === contentGroup1.value) && cg.contents.some(c => c.label === contentGroup2.label && c.value === contentGroup2.value))
  if (data && data.contents.length) {
    const obj = data && data.contents.find(c => c.label === key)
    if (obj && obj.type === 'int64') {
      return parseInt(obj.value)
    }
    return obj && obj.value
  }
  return null
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const documents = {
  methods: {
    sleep,
    getValue: getValueFromDocument,
    getValueFilters: getValueFromDocumentFilters,
    openUrl (url) {
      window.open(url)
    }
  }
}
