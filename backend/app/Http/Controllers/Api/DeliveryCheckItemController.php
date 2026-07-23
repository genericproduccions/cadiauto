<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCheckItemsRequest;
use App\Models\Delivery;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Gate;

class DeliveryCheckItemController extends Controller
{
    public function index(Delivery $delivery)
    {
        Gate::authorize('view', $delivery);

        return response()->json($delivery->checkItems()->get()->groupBy('category'));
    }

    public function update(UpdateCheckItemsRequest $request, Delivery $delivery)
    {
        foreach ($request->validated('items') as $itemData) {
            $delivery->checkItems()->whereKey($itemData['id'])->update([
                'status' => $itemData['status'] ?? null,
                'comment' => $itemData['comment'] ?? null,
            ]);
        }

        AuditLogger::log('checklist_updated', "Acta d'estat actualitzada per l'entrega #{$delivery->id}.", $delivery, request: $request);

        return response()->json($delivery->checkItems()->get()->groupBy('category'));
    }
}
