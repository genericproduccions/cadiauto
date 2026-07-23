#!/usr/bin/env bash
#
# Arrenca l'app Cadí Auto en local: backend Laravel + frontend Vite.
# Ús:
#   ./start.sh
#   BACKEND_PORT=8001 FRONTEND_PORT=5174 ./start.sh   (si els ports per defecte estan ocupats)
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

port_in_use() {
  lsof -i ":$1" -sTCP:LISTEN -t >/dev/null 2>&1
}

echo "==> Cadí Auto — arrencada en local"

if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "ERROR: falta backend/.env. Copia backend/.env.example i configura la base de dades abans de continuar." >&2
  exit 1
fi

if [ ! -d "$BACKEND_DIR/vendor" ]; then
  echo "==> Instal·lant dependències de Composer..."
  (cd "$BACKEND_DIR" && composer install)
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "==> Instal·lant dependències de npm..."
  (cd "$FRONTEND_DIR" && npm install)
fi

if port_in_use "$BACKEND_PORT"; then
  echo "ERROR: el port $BACKEND_PORT ja està en ús (backend)." >&2
  echo "       Atura el procés que l'ocupa o arrenca amb BACKEND_PORT=<altre_port> ./start.sh" >&2
  exit 1
fi

if port_in_use "$FRONTEND_PORT"; then
  echo "ERROR: el port $FRONTEND_PORT ja està en ús (frontend)." >&2
  echo "       Atura el procés que l'ocupa o arrenca amb FRONTEND_PORT=<altre_port> ./start.sh" >&2
  exit 1
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "==> Aturant servidors..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> Arrencant backend (Laravel) a http://localhost:$BACKEND_PORT ..."
(cd "$BACKEND_DIR" && php artisan serve --port="$BACKEND_PORT") &
BACKEND_PID=$!

echo "==> Arrencant frontend (Vite) a http://localhost:$FRONTEND_PORT ..."
(cd "$FRONTEND_DIR" && npm run dev -- --port "$FRONTEND_PORT" --strictPort) &
FRONTEND_PID=$!

sleep 2

cat <<EOF

--------------------------------------------------------
 Cadí Auto en marxa

   Panell intern / Àrea de client:  http://localhost:$FRONTEND_PORT
   API backend:                     http://localhost:$BACKEND_PORT/api

 Usuaris de prova:
   Admin:      admin@cadiauto.net / password
   Comercial:  comercial@cadiauto.net / password
   Client:     client@cadiauto.net / 12345678A

 Prem Ctrl+C per aturar els dos servidors.
--------------------------------------------------------

EOF

wait
