<?php

namespace App\Models;

use App\Enums\CheckItemStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryCheckItem extends Model
{
    protected $fillable = [
        'delivery_id',
        'category',
        'item_name',
        'status',
        'comment',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'status' => CheckItemStatus::class,
        ];
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }
}
