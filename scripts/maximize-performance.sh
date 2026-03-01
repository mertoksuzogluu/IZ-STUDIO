#!/bin/bash
cd /var/www/feelstudio

echo "=== PERFORMANS MAKSIMIZASYONU ==="
echo ""

# 1. CPU cekirdek sayisi
CORES=$(nproc)
echo "CPU cekirdek: $CORES"
echo "RAM: $(free -h | awk '/Mem:/ {print $2}')"
echo ""

# 2. PM2 cluster mode - tum cekirdekleri kullan
echo "=== PM2 cluster mode ==="
cat > ecosystem.config.cjs << 'ECOEOF'
const path = require("path")
const os = require("os")
const cpus = os.cpus().length
const instances = Math.max(2, cpus)

module.exports = {
  apps: [
    {
      name: "feelstudio",
      script: path.join(__dirname, "node_modules/next/dist/bin/next"),
      args: "start",
      cwd: __dirname,
      instances: instances,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
      },
    },
  ],
}
ECOEOF
echo "PM2 $CORES instance olarak ayarlandi (cluster mode)"

# 3. PostgreSQL performans ayarlari
echo ""
echo "=== PostgreSQL optimizasyonu ==="
TOTAL_RAM_MB=$(free -m | awk '/Mem:/ {print $2}')
SHARED_BUFFERS=$((TOTAL_RAM_MB / 4))
EFFECTIVE_CACHE=$((TOTAL_RAM_MB * 3 / 4))
WORK_MEM=$((TOTAL_RAM_MB / 100))

PG_CONF=$(find /etc/postgresql -name postgresql.conf 2>/dev/null | head -1)
if [ -n "$PG_CONF" ]; then
  cp "$PG_CONF" "${PG_CONF}.backup"
  
  sed -i "s/^#*shared_buffers.*/shared_buffers = ${SHARED_BUFFERS}MB/" "$PG_CONF"
  sed -i "s/^#*effective_cache_size.*/effective_cache_size = ${EFFECTIVE_CACHE}MB/" "$PG_CONF"
  sed -i "s/^#*work_mem.*/work_mem = ${WORK_MEM}MB/" "$PG_CONF"
  sed -i "s/^#*max_connections.*/max_connections = 200/" "$PG_CONF"
  sed -i "s/^#*maintenance_work_mem.*/maintenance_work_mem = 128MB/" "$PG_CONF"
  sed -i "s/^#*random_page_cost.*/random_page_cost = 1.1/" "$PG_CONF"
  sed -i "s/^#*effective_io_concurrency.*/effective_io_concurrency = 200/" "$PG_CONF"
  
  echo "PostgreSQL ayarlari guncellendi:"
  echo "  shared_buffers = ${SHARED_BUFFERS}MB"
  echo "  effective_cache_size = ${EFFECTIVE_CACHE}MB"
  echo "  work_mem = ${WORK_MEM}MB"
  echo "  max_connections = 200"
  
  systemctl restart postgresql 2>/dev/null && echo "PostgreSQL yeniden baslatildi" || echo "PostgreSQL restart icin: sudo systemctl restart postgresql"
else
  echo "postgresql.conf bulunamadi, atlanıyor"
fi

# 4. Nginx optimizasyonu
echo ""
echo "=== Nginx optimizasyonu ==="
NGINX_CONF="/etc/nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
  cp "$NGINX_CONF" "${NGINX_CONF}.backup"
  
  cat > "$NGINX_CONF" << 'NGINXEOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 1000;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 200M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;

    # Cache
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINXEOF
  echo "Nginx ana config guncellendi"
fi

# Site config'e caching ve upstream ekle
SITE_CONF="/etc/nginx/sites-available/feelcreativestudio.com"
if [ -f "$SITE_CONF" ]; then
  # Upstream yoksa ekle
  if ! grep -q "upstream feelstudio" "$SITE_CONF"; then
    # Yeni site config
    cat > "$SITE_CONF" << 'SITEEOF'
upstream feelstudio_backend {
    least_conn;
    server 127.0.0.1:3010;
    keepalive 32;
}

server {
    server_name feelcreativestudio.com www.feelcreativestudio.com;
    client_max_body_size 200M;

    # Static dosya cache
    location /_next/static/ {
        proxy_pass http://feelstudio_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /api/ {
        proxy_pass http://feelstudio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    location / {
        proxy_pass http://feelstudio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/feelcreativestudio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/feelcreativestudio.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.feelcreativestudio.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = feelcreativestudio.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name feelcreativestudio.com www.feelcreativestudio.com;
    return 404;
}
SITEEOF
    echo "Nginx site config guncellendi (upstream + cache)"
  fi
fi

nginx -t 2>&1 && systemctl reload nginx && echo "Nginx reload OK" || echo "Nginx config hatasi!"

# 5. Sistem limitleri
echo ""
echo "=== Sistem limitleri ==="
if ! grep -q "feelstudio" /etc/security/limits.conf 2>/dev/null; then
  echo "* soft nofile 65535" >> /etc/security/limits.conf
  echo "* hard nofile 65535" >> /etc/security/limits.conf
  echo "Dosya limiti arttirildi: 65535"
fi

# 6. PM2 yeniden baslat (cluster mode)
echo ""
echo "=== PM2 cluster restart ==="
pm2 stop feelstudio 2>/dev/null
pm2 delete feelstudio 2>/dev/null
pm2 start ecosystem.config.cjs
pm2 save

sleep 3
echo ""
echo "=== SONUC ==="
pm2 status
echo ""
echo "=== Kapasite ozeti ==="
echo "  PM2 instances: $CORES (cluster mode)"
echo "  PostgreSQL max_connections: 200"
echo "  Nginx worker_connections: 4096"
echo "  Tahmini es zamanli kullanici: ~${CORES}00-${CORES}000"
echo ""
echo "=== TAMAMLANDI ==="
