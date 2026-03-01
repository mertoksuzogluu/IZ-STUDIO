/**
 * PM2 ile çalıştırmak için (Windows / Linux):
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 * Restart: pm2 restart feelstudio
 */
const path = require("path")
module.exports = {
  apps: [
    {
      name: "feelstudio",
      script: path.join(__dirname, "node_modules/next/dist/bin/next"),
      args: "start",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
      },
    },
  ],
}
