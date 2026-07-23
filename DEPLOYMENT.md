# Desplegament a producció — Cadí Auto

L'aplicació es desplega en un hosting compartit amb accés SSH, servint **frontend i backend des del mateix
document root** (`~/web`), amb reescriptura via `.htaccess`. El desplegament s'automatitza amb GitHub Actions:
cada `git push` a `main` connecta per SSH al servidor i executa `deploy/deploy.sh`.

## 0. Arquitectura de desplegament

```
~/private/clients/          <- repositori clonat (git@github.com:genericproduccions/cadiauto.git)
  backend/                     Laravel (no és accessible directament des del web)
  frontend/                    React + Vite
  deploy/
    deploy.sh                  script que executa el desplegament al servidor
    backend-index.php          punt d'entrada de Laravel adaptat per viure fora de backend/public/
    htaccess                   reescriptura d'Apache

~/web/                       <- document root públic (Apache)
  index.html, assets/...       build de frontend/dist/ (es regenera a cada desplegament)
  backend-index.php            còpia de deploy/backend-index.php
  storage -> ~/private/clients/backend/storage/app/public   (symlink)
  .htaccess                     còpia de deploy/htaccess
```

`.htaccess` reescriu:
- `/api/*` i `/sanctum/*` → `backend-index.php` (Laravel)
- qualsevol altra ruta que no sigui un fitxer/directori real → `index.html` (SPA de React)

Com que frontend i backend es serveixen des del **mateix origen**, `VITE_API_URL=/api` (ruta relativa) — no cal
configurar CORS entre dominis diferents.

## 1. Primer desplegament (manual, un sol cop)

### 1.1 Clau SSH perquè el servidor pugui clonar el repositori privat

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Afegeix aquesta clau pública a GitHub → **Settings del repositori → Deploy keys** (o al teu compte, si el
repositori és privat i el clones amb el teu usuari). Comprova la connexió:

```bash
ssh -T git@github.com
```

### 1.2 Clonar el projecte

```bash
mkdir -p ~/private && cd ~/private
git clone git@github.com:genericproduccions/cadiauto.git clients
```

### 1.3 Configurar el backend

```bash
cd ~/private/clients/backend
cp .env.example .env
nano .env   # configura DB_*, MAIL_*, COMPANY_*, APP_URL, etc. (vegeu backend/.env.example)
```

**Important:** `deploy.sh` no toca mai el `.env` — cal crear-lo i configurar-lo manualment la primera vegada, i
no torna a fer-se automàticament en cada desplegament (per evitar sobreescriure secrets de producció).

### 1.4 Primer desplegament manual

```bash
bash ~/private/clients/deploy/deploy.sh
```

Això instal·la dependències, migra la base de dades, compila el frontend i publica els fitxers a `~/web`.

## 2. Automatitzar amb GitHub Actions

### 2.1 Clau SSH perquè GitHub Actions es connecti al servidor

Per a aquesta connexió (GitHub → servidor) cal una clau el component **públic** de la qual estigui a
`~/.ssh/authorized_keys` **del servidor**, i el component **privat** el guardem com a secret a GitHub. És la
direcció contrària a la clau de l'apartat 1.1 (aquella és perquè el *servidor* parli amb GitHub per clonar).

Si ja tens una clau al servidor que et serveix (per exemple la `~/.ssh/id_ed25519` que vas fer servir per
donar-la d'alta a GitHub com a deploy key), la pots reutilitzar per a totes dues coses sense generar-ne una
de nova — només cal afegir la seva pública als `authorized_keys` del mateix servidor:

```bash
# Al servidor — afegeix la clau només si no hi és ja i garantint un salt de línia
# (fer servir `>>` directament pot ajuntar la clau nova amb l'última línia existent
# si el fitxer no acaba en salt de línia, corrompent totes dues entrades):
KEY="$(cat ~/.ssh/id_ed25519.pub)"
touch ~/.ssh/authorized_keys
grep -qxF "$KEY" ~/.ssh/authorized_keys || printf '\n%s\n' "$KEY" >> ~/.ssh/authorized_keys
sed -i '/^$/d' ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/authorized_keys   # comprova que cada clau ocupa la seva pròpia línia

# Mostra la clau privada per copiar-la al secret de GitHub (apartat 2.2):
cat ~/.ssh/id_ed25519
```

Copia tota la sortida d'aquest últim `cat` (incloent les línies `-----BEGIN OPENSSH PRIVATE KEY-----` i
`-----END OPENSSH PRIVATE KEY-----`) — és el valor del secret `SSH_PRIVATE_KEY`.

> **Nota de seguretat:** reutilitzar la mateixa clau per a totes dues direccions és més senzill, però vol dir
> que si el secret `SSH_PRIVATE_KEY` de GitHub es filtrés algun dia, qui el tingués podria tant entrar al
> servidor com (si la pública segueix donada d'alta com a deploy key) clonar el repositori. Per a un projecte
> intern com aquest sol ser un risc acceptable; si en el futur vols aïllar-ho, genera una clau nova només per
> a aquest propòsit (`ssh-keygen -t ed25519 -f ~/.ssh/cadiauto_deploy -N ""`) i repeteix els mateixos passos amb
> els seus fitxers.

### 2.2 Secrets al repositori de GitHub

A GitHub → **Settings → Secrets and variables → Actions**, crea:

| Secret | Valor |
|---|---|
| `SSH_HOST` | IP o hostname del servidor (p. ex. `aw01ww05.okitup.net`) |
| `SSH_USER` | usuari SSH (p. ex. `web54` — el mateix que fas servir per connectar-t'hi tu) |
| `SSH_PRIVATE_KEY` | contingut sencer de `~/.ssh/id_ed25519` al servidor (la clau **privada**, no la `.pub`) |
| `SSH_PORT` | (opcional) port SSH, si no és el 22 |

El workflow ja està creat a `.github/workflows/deploy.yml`: a cada `git push` a `main` (o manualment des de la
pestanya "Actions" → "Run workflow"), es connecta per SSH i executa:

```bash
cd ~/private/clients && git fetch origin main && git reset --hard origin/main && bash deploy/deploy.sh
```

### 2.3 Comprovar que funciona

Fes un canvi petit, `git push origin main`, i mira la pestanya **Actions** del repositori a GitHub — hauries de
veure el job "Deploy to production" en verd. Si falla, els logs del pas "Deploy via SSH" mostren la sortida
completa del `deploy.sh` executat al servidor.

## 3. Què fa `deploy/deploy.sh`

1. `composer install --no-dev` al backend.
2. `php artisan migrate --force` (migracions noves, mai `migrate:fresh` — no esborra dades).
3. `php artisan storage:link`, permisos de `storage/` i `bootstrap/cache/`.
4. `php artisan optimize:clear` + `php artisan optimize` (cachea config/rutes/vistes).
5. `npm ci && npm run build` al frontend (amb `VITE_API_URL=/api`).
6. Buida `~/web/` i hi copia el build del frontend + `backend-index.php` + `.htaccess` + el symlink de `storage`.

No executa mai seeders ni `migrate:fresh` — és segur executar-lo repetidament sense perdre dades.

## 4. Correu, backups i checklist de producció

- **Correu**: configura `MAIL_MAILER=smtp` i les credencials reals a `backend/.env` (per defecte fa servir
  `log`, que no envia res). Verifica SPF/DKIM del domini remitent perquè els PDF adjunts no acabin a spam.
- **Backups**: fes còpia regular de la base de dades i de `~/private/clients/backend/storage/app/private/`
  (fotos, documents pujats, PDFs generats i signatures de cada entrega). Si es perd aquest directori sense
  còpia, es perd tota la documentació signada.
- **Abans de publicar**, comprova:
  - [ ] `APP_ENV=production` i `APP_DEBUG=false` a `backend/.env`
  - [ ] `APP_KEY` generada de nou per a producció (`php artisan key:generate`, no reutilitzar la de local)
  - [ ] Contrasenyes de base de dades i SMTP fortes i diferents de les de desenvolupament
  - [ ] Usuaris reals (admin/comercials) creats i les contrasenyes de demo (`admin@cadiauto.net` / `password`)
        eliminades o canviades — **no** s'ha d'executar `db:seed` en producció
  - [ ] HTTPS actiu (certificat SSL al domini públic)
  - [ ] Prova completa del flux: login, crear entrega, pujar foto/document, generar PDF, signar des del mòbil
