module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    public: "PLEASECHANGEME:8080",
    proxy: {
      "^/api": {
        target: "http://localhost:3301",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
