module.exports = {
  apps : [
      {
        name: "Food For Now",
        script: ".",
        watch: true,
        exec_mode : "cluster",
        instances : 1,
        env: {
          "NODE_ENV": "development",
          "HTTP_PORT": 6969,
          "HTTPS_PORT": 3443
        }
      }
  ]
}
