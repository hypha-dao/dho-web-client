export default function paginate(a, pageIndex, pageSize) {
  const endIndex = Math.min((pageIndex + 1) * pageSize, a.length)
  return a.slice(Math.max(endIndex - pageSize, 0), endIndex)
}
