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

export const documents = {
  methods: {
    getValue: getValueFromDocument,
    openUrl (url) {
      window.open(url)
    }
  }
}
