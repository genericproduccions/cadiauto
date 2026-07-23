<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Signature extends Model
{
    protected $fillable = [
        'delivery_id',
        'image_path',
        'ip_address',
        'user_agent',
        'signed_at',
        'access_token_used',
        'legal_acceptance',
    ];

    protected function casts(): array
    {
        return [
            'signed_at' => 'datetime',
            'legal_acceptance' => 'boolean',
        ];
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }
}
