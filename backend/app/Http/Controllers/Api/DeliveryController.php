<?php

namespace App\Http\Controllers\Api;

use App\Enums\DeliveryStatus;
use App\Enums\VehicleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeliveryRequest;
use App\Http\Requests\UpdateDeliveryRequest;
use App\Models\Delivery;
use App\Models\DeliveryCheckItem;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class DeliveryController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Delivery::class);

        $deliveries = Delivery::query()
            ->with(['client', 'vehicle', 'salesperson'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($q) use ($search) {
                    $q->whereHas('client', fn ($c) => $c->where('full_name', 'like', "%{$search}%")->orWhere('nif', 'like', "%{$search}%"))
                        ->orWhereHas('vehicle', fn ($v) => $v->where('plate', 'like', "%{$search}%"));
                });
            })
            ->latest('delivery_datetime')
            ->paginate(20);

        return response()->json($deliveries);
    }

    public function store(StoreDeliveryRequest $request)
    {
        $delivery = DB::transaction(function () use ($request) {
            $delivery = Delivery::create($request->validated() + ['status' => DeliveryStatus::Draft]);

            $sortOrder = 0;
            foreach (config('checklist') as $category => $items) {
                foreach ($items as $itemName) {
                    DeliveryCheckItem::create([
                        'delivery_id' => $delivery->id,
                        'category' => $category,
                        'item_name' => $itemName,
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }

            $delivery->vehicle()->update(['status' => VehicleStatus::Sold]);

            return $delivery;
        });

        AuditLogger::log('delivery_created', "Entrega #{$delivery->id} creada.", $delivery, request: $request);

        return response()->json($delivery->load(['client', 'vehicle', 'salesperson', 'checkItems']), 201);
    }

    public function show(Delivery $delivery)
    {
        Gate::authorize('view', $delivery);

        $delivery->load([
            'client', 'vehicle', 'salesperson', 'checkItems', 'photos', 'documents', 'generatedDocuments', 'signature',
        ]);
        $delivery->setRelation('generatedDocuments', $delivery->latestGeneratedDocuments());

        return response()->json($delivery);
    }

    public function update(UpdateDeliveryRequest $request, Delivery $delivery)
    {
        $delivery->update($request->validated());

        AuditLogger::log('delivery_updated', "Entrega #{$delivery->id} actualitzada.", $delivery, request: $request);

        return response()->json($delivery->load(['client', 'vehicle', 'salesperson']));
    }

    public function destroy(Delivery $delivery)
    {
        Gate::authorize('delete', $delivery);

        $delivery->delete();

        return response()->json(null, 204);
    }
}
