# =============================================================================
# Etapa 1: Construcción estática con Node.js y Vite
# =============================================================================
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_USAR_MOCK=false
ARG VITE_API_URL=http://localhost:5000
ENV VITE_USAR_MOCK=${VITE_USAR_MOCK} \
    VITE_API_URL=${VITE_API_URL}

RUN npm run build

# =============================================================================
# Etapa 2: Servidor web ligero Nginx en puerto 5173 (coincidente con CORS API)
# =============================================================================
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

# Configuración SPA en puerto 5173 con soporte de enrutamiento React Router y proxy /api opcional
RUN printf 'server {\n\
    listen 5173;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location /api/ {\n\
        resolver 127.0.0.11 valid=30s;\n\
        set $api_upstream http://api:5000;\n\
        proxy_pass $api_upstream;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
