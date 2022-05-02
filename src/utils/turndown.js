import Showdown from 'showdown'
import Turndown from 'turndown'

const _converter = new Showdown.Converter()
const _turndown = new Turndown()

// Showdown.setOption('strikethrough', true)
// Showdown.setOption('underline', true)

// _turndown.addRule('strikethrough', {
//   filter: ['del', 's', 'strike'],
//   replacement: function (content) {
//     return '~~' + content + '~~'
//   }
// })

// Object.defineProperty(_turndown.options, 'emDelimiter', {
//   get: () => '*'
// })

// Object.defineProperty(_turndown.options, 'strongDelimiter', {
//   get: () => '**'
// })

// _turndown.addRule('underline', {
//   filter: 'u',
//   replacement: function (content) {
//     return `__${content}__`
//   }
// })

export const converter = _converter
export const turndown = _turndown

export const toMarkdown = (...props) => _turndown.turndown(...props)
export const toHTML = (...props) => _converter.makeHtml(...props)
