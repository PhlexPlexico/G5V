module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    public: "http://204.83.44.105:8080",
    proxy: {
      "^/api": {
        target: "http://204.83.44.105:3301",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
