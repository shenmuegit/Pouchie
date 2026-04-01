import { createApiApp } from "./create-app";

const app = createApiApp();

export default {
  fetch: app.fetch
};

