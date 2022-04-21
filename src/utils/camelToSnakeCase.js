export default function camelToSnakeCase (str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}
