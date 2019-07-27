module.exports = {
    publicPath: "spellcheck",
    configureWebpack: {
      module: {
        rules: [
          {
            test: /.html$/,
            loader: "vue-template-loader",
            exclude: /index.html/
          }
        ]
      }
    }
  }
  