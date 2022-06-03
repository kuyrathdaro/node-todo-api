module.exports = {
  apps: [
    {
      name: "node-todo-api-dev",
      script: "ts-node",
      args: "-r tsconfig-paths/register ./src/app.ts",
    },
  ],
};
