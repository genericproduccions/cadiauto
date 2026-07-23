<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeliveryPhotoRequest;
use App\Models\Delivery;
use App\Models\DeliveryPhoto;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DeliveryPhotoController extends Controller
{
    public function index(Delivery $delivery)
    {
        Gate::authorize('view', $delivery);

        return response()->json($delivery->photos);
    }

    public function store(StoreDeliveryPhotoRequest $request, Delivery $delivery)
    {
        $file = $request->file('photo');
        $path = $file->store("deliveries/{$delivery->id}/photos", 'local');

        $photo = $delivery->photos()->create([
            'type' => $request->validated('type'),
            'path' => $path,
            'caption' => $request->validated('caption'),
        ]);

        AuditLogger::log('photo_uploaded', "Foto '{$photo->type->label()}' pujada a l'entrega #{$delivery->id}.", $delivery, request: $request);

        return response()->json($photo, 201);
    }

    public function show(Delivery $delivery, DeliveryPhoto $photo)
    {
        Gate::authorize('view', $delivery);

        abort_unless($photo->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($photo->path);
    }

    public function destroy(Delivery $delivery, DeliveryPhoto $photo)
    {
        Gate::authorize('update', $delivery);

        abort_unless($photo->delivery_id === $delivery->id, 404);

        Storage::disk('local')->delete($photo->path);
        $photo->delete();

        return response()->json(null, 204);
    }
}
