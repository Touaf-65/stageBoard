# ============================================================
# [FRONTEND] stageBoard — Dockerfile (Angular FIX)
# ============================================================

# ── Étape 1 : Build Angular ─────────────────────────────────
FROM node:20 AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Build Angular (important : --configuration production)
RUN npm run build -- --configuration production

# ── Étape 2 : Nginx ─────────────────────────────────────────
FROM nginx:1.28-alpine AS production

# Angular build output est dans dist/<project-name>
COPY --from=builder /app/dist/stageBoard/browser /usr/share/nginx/html

# Config nginx
COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]