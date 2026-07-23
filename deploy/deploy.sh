#!/usr/bin/env bash
#
# Desplegament a producció — s'executa AL SERVIDOR (via SSH des de GitHub Actions,
# o manualment). Assumeix que el codi ja ha estat actualitzat (git fetch + reset)
# abans de cridar aquest script — vegeu .github/workflows/deploy.yml.
#
# Estructura de directoris esperada al servidor:
#   ~/private/clients/          <- aquest repositori (clonat)
#   ~/web/                      <- document root públic (frontend estàtic + backend-index.php)
#
set -euo pipefail

REPO_DIR="$HOME/private/clients"
WEB_DIR="$HOME/web"
PHP_BIN="${PHP_BIN:-/usr/bin/php8.2}"
COMPOSER_BIN="${COMPOSER_BIN:-/usr/local/bin/composer}"

echo "==> Backend: instal·lant dependències..."
cd "$REPO_DIR/backend"

if [ ! -f .env ]; then
  echo "ERROR: backend/.env no existeix al servidor." >&2
  echo "       Configura'l manualment (cp .env.example .env && nano .env) abans del primer desplegament." >&2
  exit 1
fi

"$PHP_BIN" "$COMPOSER_BIN" install --no-dev --prefer-dist --optimize-autoloader --no-interaction

echo "==> Backend: migracions..."
"$PHP_BIN" artisan migrate --force

echo "==> Backend: storage i permisos..."
"$PHP_BIN" artisan storage:link || true
chmod -R 775 storage bootstrap/cache

echo "==> Backend: optimització..."
"$PHP_BIN" artisan optimize:clear
"$PHP_BIN" artisan optimize

echo "==> Frontend: build..."
cd "$REPO_DIR/frontend"
echo "VITE_API_URL=/api" > .env.production
npm ci
npm run build

echo "==> Publicant a $WEB_DIR..."
rm -rf "${WEB_DIR:?}"/*
cp -a "$REPO_DIR/frontend/dist/." "$WEB_DIR/"
cp "$REPO_DIR/deploy/backend-index.php" "$WEB_DIR/backend-index.php"
ln -sfn "$REPO_DIR/backend/storage/app/public" "$WEB_DIR/storage"
cp "$REPO_DIR/deploy/htaccess" "$WEB_DIR/.htaccess"

echo "==> Desplegament complet."
