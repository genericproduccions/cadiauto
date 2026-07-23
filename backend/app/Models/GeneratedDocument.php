<?php

namespace App\Models;

use App\Enums\GeneratedDocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedDocument extends Model
{
    protected $fillable = [
        'delivery_id',
        'type',
        'path',
        'version',
        'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => GeneratedDocumentType::class,
            'generated_at' => 'datetime',
        ];
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }
}
