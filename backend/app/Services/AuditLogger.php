<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Delivery;
use App\Models\User;
use Illuminate\Http\Request;

class AuditLogger
{
    public static function log(string $action, ?string $description = null, ?Delivery $delivery = null, ?User $user = null, ?Request $request = null): AuditLog
    {
        $request ??= request();

        return AuditLog::create([
            'user_id' => $user?->id ?? $request?->user()?->id,
            'delivery_id' => $delivery?->id,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request?->ip(),
        ]);
    }
}
