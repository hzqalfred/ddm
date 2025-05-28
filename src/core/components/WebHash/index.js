import router from "./router";
const webHash = {
  install(app) {
    app.use(router);
  },
};

export default webHash;
