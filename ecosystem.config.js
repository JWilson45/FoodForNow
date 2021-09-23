module.exports = {
  apps : [
      {
        name: "Food For Now",
        script: ".",
        watch: true,
        instances : "1",
        exec_mode : "cluster",
        env: {
          "NODE_ENV": "development",
          "HTTP_PORT": 8080,
          "HTTPS_PORT": 3443
        },
        env_production: {
          "NODE_ENV": "production",
          "HTTP_PORT": 80,
          "HTTPS_PORT": 443
        }
      }
  ]
}
