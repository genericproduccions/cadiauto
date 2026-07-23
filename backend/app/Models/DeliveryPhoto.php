<?php

namespace App\Models;

use App\Enums\PhotoType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryPhoto extends Model
{
    protected $fillable = [
        'delivery_id',
        'type',
        'path',
        'caption',
    ];

    protected function casts(): array
    {
        return [
            'type' => PhotoType::class,
        ];
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }
}
