# ============================================================
# [FRONTEND] stageBoard — Dockerfile
# ============================================================

# ── Étape 1 : Build de l'application React/Vue ───────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package*.json ./

# Installer les dépendances (ci = install propre, reproductible)
RUN npm ci

# Copier le reste du code source
COPY . .

# Build de production (génère le dossier dist/)
RUN npm run build

# ── Étape 2 : Image de production avec Nginx ─────────────────
FROM nginx:1.25-alpine AS production

# Copier les fichiers buildés dans le dossier servi par Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]