module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      '/api*': {
        target: 'http://91.240.86.247:3000',
        ws: true,
        changeOrigin: true
      },
      '/files*': {
        target: 'http://91.240.86.247',
        ws: true,
        changeOrigin: true
      }
    }
  },
}
