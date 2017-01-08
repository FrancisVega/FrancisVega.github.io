const cwd = process.cwd()
const media = require(`${cwd}/src/tokens/media.json`)
const containers = require(`${cwd}/src/tokens/containers.json`)
const fonts = require(`${cwd}/src/tokens/fonts.json`)
const spacing = require(`${cwd}/src/tokens/spacing.json`)

module.exports = {
  context: {
    designtokens: [media, containers, fonts,  spacing]
  }
}
