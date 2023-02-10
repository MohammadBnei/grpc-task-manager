module.exports = {
  apps: [
    {
      name: "front",
      script: "front/build/index.js",
      env: {
        SERVER: "localhost:4000",
      },
    },
    {
      name: "server",
      script: "server/dist/main.js",
      env: {
        PROTO_FILE: "proto/task/v1beta/task.proto",
        MONGO_URL:
          "mongodb+srv://bneiconseil:KY7y8ZWy392Tmont@cluster0.23quvdx.mongodb.net/?retryWrites=true&w=majority",
        insecure: "true",
      },
    },
  ],
};
