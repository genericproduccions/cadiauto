<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeliveryDocumentRequest;
use App\Models\Delivery;
use App\Models\DeliveryDocument;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DeliveryDocumentController extends Controller
{
    public function index(Delivery $delivery)
    {
        Gate::authorize('view', $delivery);

        return response()->json($delivery->documents);
    }

    public function store(StoreDeliveryDocumentRequest $request, Delivery $delivery)
    {
        $file = $request->file('document');
        $path = $file->store("deliveries/{$delivery->id}/documents", 'local');

        $document = $delivery->documents()->create([
            'type' => $request->validated('type'),
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
        ]);

        AuditLogger::log('document_uploaded', "Document '{$document->type->label()}' pujat a l'entrega #{$delivery->id}.", $delivery, request: $request);

        return response()->json($document, 201);
    }

    public function show(Delivery $delivery, DeliveryDocument $document)
    {
        Gate::authorize('view', $delivery);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path, $document->original_name);
    }

    public function destroy(Delivery $delivery, DeliveryDocument $document)
    {
        Gate::authorize('update', $delivery);

        abort_unless($document->delivery_id === $delivery->id, 404);

        Storage::disk('local')->delete($document->path);
        $document->delete();

        return response()->json(null, 204);
    }
}
