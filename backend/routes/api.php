<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DeliveryCheckItemController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\DeliveryDocumentController;
use App\Http\Controllers\Api\DeliveryPhotoController;
use App\Http\Controllers\Api\GeneratedDocumentController;
use App\Http\Controllers\Api\MyDeliveriesController;
use App\Http\Controllers\Api\Public\ClientDeliveryController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutes públiques (àrea client, accés per token privat)
|--------------------------------------------------------------------------
*/

Route::prefix('public/deliveries/{token}')->group(function () {
    Route::get('/', [ClientDeliveryController::class, 'show']);
    Route::get('photos/{photo}', [ClientDeliveryController::class, 'photo']);
    Route::get('documents/{document}', [ClientDeliveryController::class, 'document']);
    Route::get('generated-documents/{document}', [ClientDeliveryController::class, 'generatedDocument']);
    Route::post('sign', [ClientDeliveryController::class, 'sign']);
});

/*
|--------------------------------------------------------------------------
| Autenticació
|--------------------------------------------------------------------------
*/

Route::post('auth/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rutes internes (admin / comercial)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    Route::prefix('my/deliveries')->group(function () {
        Route::get('/', [MyDeliveriesController::class, 'index']);
        Route::get('{delivery}', [MyDeliveriesController::class, 'show']);
        Route::get('{delivery}/photos/{photo}', [MyDeliveriesController::class, 'photo']);
        Route::get('{delivery}/documents/{document}', [MyDeliveriesController::class, 'document']);
        Route::get('{delivery}/generated-documents/{document}', [MyDeliveriesController::class, 'generatedDocument']);
    });

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('deliveries', DeliveryController::class);

    Route::prefix('deliveries/{delivery}')->group(function () {
        Route::get('check-items', [DeliveryCheckItemController::class, 'index']);
        Route::put('check-items', [DeliveryCheckItemController::class, 'update']);

        Route::get('photos', [DeliveryPhotoController::class, 'index']);
        Route::post('photos', [DeliveryPhotoController::class, 'store']);
        Route::get('photos/{photo}', [DeliveryPhotoController::class, 'show']);
        Route::delete('photos/{photo}', [DeliveryPhotoController::class, 'destroy']);

        Route::get('documents', [DeliveryDocumentController::class, 'index']);
        Route::post('documents', [DeliveryDocumentController::class, 'store']);
        Route::get('documents/{document}', [DeliveryDocumentController::class, 'show']);
        Route::delete('documents/{document}', [DeliveryDocumentController::class, 'destroy']);

        Route::get('generated-documents', [GeneratedDocumentController::class, 'index']);
        Route::post('generated-documents', [GeneratedDocumentController::class, 'store']);
        Route::get('generated-documents/{document}', [GeneratedDocumentController::class, 'show']);
    });
});
