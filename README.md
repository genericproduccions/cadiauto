# Cadí Auto — Àrea de Clients i Gestió d'Entregues

Aplicació web externa a Webclick per a **Auto Gestió Cadí, S.L. (Cadí Auto)**, pensada per enllaçar-se des de
[cadiauto.net](https://cadiauto.net) amb un botó tipus "Àrea clients".

Permet al concessionari registrar l'estat d'un vehicle en el moment de l'entrega, adjuntar fotos i documentació,
generar la documentació legal en PDF (contracte, declaració de conformitat, annex de garantia, comanda de vehicle
usat i acta d'estat) i que el client la revisi i signi digitalment des d'un enllaç privat. Els clients també
disposen d'un login propi des d'on veuen el llistat de totes les seves entregues.

Interfície amb tema fosc (targetes arrodonides, badges d'estat) tant al panell intern com a l'àrea de client.

## Stack

- **Backend:** Laravel 11 + Sanctum (autenticació per token) + barryvdh/laravel-dompdf
- **Frontend:** React 19 + Vite + TailwindCSS v4 + React Router
- **Base de dades:** MySQL / MariaDB
- **Signatura:** canvas amb [signature_pad](https://github.com/szimek/signature_pad) (signatura simple amb evidència: IP, user agent, data/hora i acceptació legal — no és signatura electrònica avançada amb certificat)

### Sistema de disseny

Tema fosc definit amb variables CSS en OKLCH a `frontend/src/index.css` (`--background`, `--foreground`,
`--surface`, `--surface-elevated`, `--primary`, `--border`, `--ring`...), tipografia Plus Jakarta Sans (títols) +
Inter (cos), i classes utilitàries (`bg-gradient-primary`, `text-gradient`, `shadow-elegant`, `shadow-glow`,
`shadow-card`, `animate-fade-up`). El projecte està preparat per a [shadcn/ui](https://ui.shadcn.com)
(`components.json`, alias `@/` cap a `src/`, `src/lib/utils.js`) — per afegir un component nou:

```bash
cd frontend
npx shadcn@latest add button
```

## Estructura del projecte

```
cadiauto/
├── backend/     API REST Laravel
└── frontend/    SPA React (panell intern + àrea de clients)
```

## Requisits

- PHP 8.2+ amb extensions habituals de Laravel
- Composer
- Node.js 20+ i npm
- MySQL/MariaDB en marxa

## Instal·lació

### 1. Base de dades

Crea una base de dades buida (per exemple `cadiauto`) i un usuari amb permisos sobre aquesta.

```sql
CREATE DATABASE cadiauto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env    # si no existeix ja un .env
php artisan key:generate
```

Edita `backend/.env` i configura la connexió a la base de dades:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cadiauto
DB_USERNAME=cadiauto
DB_PASSWORD=el_teu_password
```

Configura també les dades fiscals del concessionari (apareixen als PDFs), a `backend/.env`:

```
COMPANY_NAME="Auto Gestió Cadí, S.L."
COMPANY_NIF=B00000000
COMPANY_ADDRESS="..."
COMPANY_POSTAL_CODE=25700
COMPANY_MUNICIPALITY="La Seu d'Urgell"
COMPANY_PROVINCE=Lleida
COMPANY_PHONE="..."
COMPANY_EMAIL=info@cadiauto.net
```

Migra i carrega dades d'exemple:

```bash
php artisan migrate --seed
```

Això crea:

| Usuari | Email | Contrasenya | Rol |
|---|---|---|---|
| Administrador | admin@cadiauto.net | password | admin |
| Comercial | comercial@cadiauto.net | password | comercial |
| Client de demostració | client@cadiauto.net | 12345678A | client |

...més 7 clients addicionals, 10 vehicles i 2 entregues d'exemple per al client de demostració (una en esborrany
i una pendent de signatura, amb la seva URL privada mostrada per consola en acabar el seed).

Storage privat (fotos, documents i PDFs es guarden fora del `public/`, a `storage/app/private`; no cal `storage:link`).

Arrenca el servidor:

```bash
php artisan serve
```

L'API queda disponible a `http://localhost:8000/api`.

**Email en local:** per defecte `MAIL_MAILER=log`, els correus (client + concessionari, en signar una entrega)
es guarden a `storage/logs/laravel.log` en comptes d'enviar-se de veritat. Canvia-ho a `smtp` i configura les
credencials quan calgui enviar correus reals.

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no corre a localhost:8000
npm run dev
```

L'aplicació queda disponible a `http://localhost:5173`.

- Panell intern (login admin/comercial, clients, vehicles, entregues, checklist, fotos, documents, PDFs):
  `http://localhost:5173/`
- Àrea de client — "Les meves entregues" (login del client, llista totes les seves entregues):
  `http://localhost:5173/portal`
- Fitxa individual d'una entrega dins l'àrea de client — fitxa tècnica del vehicle, fotos, documentació
  descarregable i estat del contracte (només lectura, sense signatura inline):
  `http://localhost:5173/portal/{id}`
- Revisió i signatura d'una entrega concreta (accés directe per enllaç privat, sense login — és l'enllaç que
  es comparteix per WhatsApp/email, i l'únic lloc on es pot signar): `http://localhost:5173/entrega/{token}`

El login (`/login`) és el mateix formulari per a tothom; segons el rol de l'usuari autenticat, l'app redirigeix
automàticament al panell intern o a `/portal`.

## Flux principal

1. El comercial inicia sessió al panell (`/login`).
2. Crea o selecciona un client i un vehicle.
3. Crea una entrega (queda en estat *esborrany* i genera automàticament la checklist de l'acta d'estat).
4. Omple l'acta d'estat del vehicle (categories: vehicle al terra, elevat, a mitja altura, compartiment motor,
   elements finals, prova en carretera, estat exterior/interior, mecànica, electricitat, carrosseria,
   observacions).
5. Puja fotos (frontal, posterior, laterals, interior, quadre, quilometratge, rodes, danys, altres) i documentació
   (DNI, fitxa tècnica, permís de circulació, ITV, garantia externa, altres).
6. Genera els documents PDF (contracte de compravenda, declaració de conformitat, annex de garantia, comanda de
   vehicle usat, acta d'estat amb fotos) des de la pestanya "PDFs i enllaç".
7. Copia i envia l'enllaç privat de l'entrega al client (WhatsApp, SMS, email...).
8. El client obre l'enllaç, revisa les dades, l'acta d'estat, les fotos i la documentació.
9. Accepta les condicions i signa amb el dit/ratolí sobre el canvas.
10. El sistema regenera els PDFs amb la signatura inclosa, envia còpia per email al client i al concessionari, i
    marca l'entrega com a *finalitzada*.

## Rols

- **Admin**: accés total, incloent eliminar clients/vehicles/entregues.
- **Comercial**: pot crear i gestionar clients, vehicles i entregues.
- **Client**: login propi (`/portal`), només de lectura sobre les seves pròpies entregues. En crear un client amb
  email des del panell, es provisiona automàticament un compte amb rol *client* — la contrasenya inicial és el
  seu DNI/NIF en majúscules i sense espais (es mostra un avís amb aquesta informació al formulari del client).
  La revisió i signatura d'una entrega concreta es continua fent sempre a través de l'enllaç privat per token
  (amb o sense sessió iniciada), que és el que queda registrat com a evidència de signatura.

## Seguretat i auditoria

- Autenticació del panell amb Laravel Sanctum (tokens Bearer).
- Autorització amb Policies (`ClientPolicy`, `VehiclePolicy`, `DeliveryPolicy`).
- Accés del client per token aleatori de 48 caràcters amb caducitat configurable (`DELIVERY_TOKEN_TTL_DAYS`,
  30 dies per defecte).
- Fotos, documents i PDFs es serveixen sempre a través del backend (mai des d'una carpeta pública), verificant
  que l'usuari o el token té accés a l'entrega corresponent.
- Totes les accions rellevants (creació d'entrega, pujada de fitxers, generació de PDF, accés del client,
  signatura, finalització) queden registrades a `audit_logs`, i els enviaments de correu a `email_logs`.

## Pendent / següents passos

- Polir el disseny final de les plantilles PDF (ara mateix són plantilles funcionals amb totes les dades, a
  l'espera del disseny gràfic definitiu del concessionari).
- Flux de "contrasenya oblidada" / canvi de contrasenya per als clients (ara la contrasenya inicial és fixa, el
  seu DNI/NIF).
- Gestió d'usuaris (alta/baixa de comercials) des del panell — de moment es fa via `php artisan tinker` o seeders.
- Enviament de correu en cua (`ShouldQueue`) si el volum d'entregues ho justifica.
