# 1) Builder: instala deps y hace la build de Angular
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production

# 2) Runtime: sirve la build con Nginx
FROM nginx:stable-alpine AS production

# Copiamos la carpeta correcta: dist/banner-management
COPY --from=builder /app/dist/banner-management /usr/share/nginx/html

# Configuración de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
