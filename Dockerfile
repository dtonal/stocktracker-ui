# Stage 1: Build-Umgebung für die Vue-Anwendung
FROM node:20-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
RUN npm run build

# ---

# Stage 2: Produktions-Umgebung mit Nginx
# Wir verwenden das offizielle Image, das bereits ein schlaues Entrypoint-Skript hat.
FROM nginx:stable-alpine

# Das offizielle Entrypoint-Skript sucht nach Template-Dateien in diesem Verzeichnis.
# Es wird automatisch 'envsubst' darauf anwenden, um Umgebungsvariablen wie ${PORT} zu ersetzen.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Kopiere die gebauten statischen Dateien aus dem "build-stage"
# HIER LIEGT DAS PROBLEM. WIR MÜSSEN DEN INHALT VON 'dist' KOPIEREN, NICHT DEN ORDNER SELBST.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Wir müssen nichts weiter tun. Der EXPOSE- und CMD-Befehl ist bereits
# im Basis-Image enthalten und wird automatisch den PORT von Cloud Run verwenden.