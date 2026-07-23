<?php

namespace App\Http\Controllers\Api;

use App\Enums\DeliveryStatus;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Delivery;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || $user->isComercial(), 403);

        return response()->json([
            'total_deliveries' => Delivery::count(),
            'pending_signature_deliveries' => Delivery::where('status', DeliveryStatus::PendingSignature)->count(),
            'signed_deliveries' => Delivery::whereIn('status', [DeliveryStatus::Signed, DeliveryStatus::Completed])->count(),
            'total_clients' => Client::count(),
            'recent_deliveries' => Delivery::with(['client', 'vehicle'])->latest()->limit(5)->get(),
            'pending_deliveries' => Delivery::with(['client', 'vehicle'])
                ->where('status', DeliveryStatus::PendingSignature)
                ->latest()
                ->limit(5)
                ->get(),
            'recent_clients' => Client::latest()->limit(5)->get(),
        ]);
    }
}
