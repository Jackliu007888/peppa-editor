const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: [path.resolve(__dirname, './src/common/style/variables.styl')]
      }
    }
  }
}