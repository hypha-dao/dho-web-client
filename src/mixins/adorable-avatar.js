import mergeImages from 'merge-images'
import { Canvas, Image } from 'canvas'

const baseUrl = 'https://assets.hypha.earth/avatars/'

const defaultColors = [
  '#81bef1',
  '#ad8bf2',
  '#bff288',
  '#de7878',
  '#a5aac5',
  '#6ff2c5',
  '#f0da5e',
  '#eb5972',
  '#f6be5d'
]

const avatarsSize = 8

export const adorableAvatar = {
  methods: {
    hashToInt (str) {
      return (str.split('').reduce((acc, char) => acc + Number(char.charCodeAt(0)) || 0, 0) % avatarsSize) + 1
    },
    async getAdorableImage (hash256) {
      const eyes = hash256.substr(0, 16)
      const nose = hash256.substr(16, 16)
      const mouth = hash256.substr(32, 16)
      const color = hash256.substr(48, 16)
      const image = await mergeImages([`${baseUrl}eyes${this.hashToInt(eyes)}.png`, `${baseUrl}nose${this.hashToInt(nose)}.png`, `${baseUrl}mouth${this.hashToInt(mouth)}.png`], {
        Canvas: Canvas,
        Image: Image,
        crossOrigin: 'Anonymous'
      })

      return {
        image,
        color: defaultColors[this.hashToInt(color)]
      }
    }
  }
}
