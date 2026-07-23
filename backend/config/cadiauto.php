<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Dades del concessionari
    |--------------------------------------------------------------------------
    |
    | Dades fiscals i de contacte que apareixen a les capçaleres dels PDFs
    | generats (contractes, declaracions de conformitat, garanties, etc.).
    |
    */

    'company' => [
        'name' => env('COMPANY_NAME', 'Auto Gestió Cadí, S.L.'),
        'trade_name' => env('COMPANY_TRADE_NAME', 'Cadí Auto'),
        'nif' => env('COMPANY_NIF', ''),
        'address' => env('COMPANY_ADDRESS', ''),
        'municipality' => env('COMPANY_MUNICIPALITY', 'La Seu d\'Urgell'),
        'postal_code' => env('COMPANY_POSTAL_CODE', ''),
        'province' => env('COMPANY_PROVINCE', 'Lleida'),
        'phone' => env('COMPANY_PHONE', ''),
        'email' => env('COMPANY_EMAIL', 'info@cadiauto.net'),
        'website' => env('COMPANY_WEBSITE', 'https://cadiauto.net'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Token d'accés del client
    |--------------------------------------------------------------------------
    */

    'delivery_token_ttl_days' => env('DELIVERY_TOKEN_TTL_DAYS', 30),

];
