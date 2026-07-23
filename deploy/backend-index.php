<?php

/*
|--------------------------------------------------------------------------
| Punt d'entrada del backend en producció (hosting compartit)
|--------------------------------------------------------------------------
|
| Còpia de backend/public/index.php, adaptada perquè es pot servir des de
| ~/web/backend-index.php (fora de backend/public/), sense necessitat que el
| document root apunti dins del repositori. Els .htaccess reescriuen les
| peticions a /api/* i /sanctum/* cap a aquest fitxer (vegeu deploy/htaccess).
|
| Assumeix l'estructura de directoris:
|   ~/web/backend-index.php   (aquest fitxer)
|   ~/private/clients/backend (el backend Laravel)
|
*/

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$backend = __DIR__.'/../private/clients/backend';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $backend.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $backend.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once $backend.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
