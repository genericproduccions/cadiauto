<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\DeliveryDocument;
use App\Models\DeliveryPhoto;
use App\Models\GeneratedDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MyDeliveriesController extends Controller
{
    private function ownDelivery(Request $request, Delivery $delivery): Delivery
    {
        $user = $request->user();
        abort_unless($user->isClient() && $user->client_id, 403);
        abort_unless($delivery->client_id === $user->client_id, 404);

        return $delivery;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user->isClient() && $user->client_id, 403);

        $deliveries = Delivery::query()
            ->where('client_id', $user->client_id)
            ->with('vehicle')
            ->latest('delivery_datetime')
            ->get();

        return response()->json($deliveries);
    }

    public function show(Request $request, Delivery $delivery)
    {
        $delivery = $this->ownDelivery($request, $delivery);

        $delivery->load(['client', 'vehicle', 'salesperson', 'photos', 'documents', 'generatedDocuments', 'signature']);
        $delivery->setRelation('generatedDocuments', $delivery->latestGeneratedDocuments());

        return response()->json($delivery);
    }

    public function photo(Request $request, Delivery $delivery, DeliveryPhoto $photo)
    {
        $delivery = $this->ownDelivery($request, $delivery);

        abort_unless($photo->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($photo->path);
    }

    public function document(Request $request, Delivery $delivery, DeliveryDocument $document)
    {
        $delivery = $this->ownDelivery($request, $delivery);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path, $document->original_name);
    }

    public function generatedDocument(Request $request, Delivery $delivery, GeneratedDocument $document)
    {
        $delivery = $this->ownDelivery($request, $delivery);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path);
    }
}
