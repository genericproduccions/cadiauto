<?php

namespace App\Models;

use App\Enums\DeliveryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Delivery extends Model
{
    /** @use HasFactory<\Database\Factories\DeliveryFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'vehicle_id',
        'salesperson_id',
        'delivery_datetime',
        'location',
        'observations',
        'status',
        'access_token',
        'token_expires_at',
        'client_viewed_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'delivery_datetime' => 'datetime',
            'token_expires_at' => 'datetime',
            'client_viewed_at' => 'datetime',
            'completed_at' => 'datetime',
            'status' => DeliveryStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Delivery $delivery) {
            if (empty($delivery->access_token)) {
                $delivery->access_token = Str::random(48);
            }

            if (empty($delivery->token_expires_at)) {
                $delivery->token_expires_at = now()->addDays((int) config('cadiauto.delivery_token_ttl_days', 30));
            }
        });
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function salesperson(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesperson_id');
    }

    public function checkItems(): HasMany
    {
        return $this->hasMany(DeliveryCheckItem::class)->orderBy('sort_order');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(DeliveryPhoto::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DeliveryDocument::class);
    }

    public function generatedDocuments(): HasMany
    {
        return $this->hasMany(GeneratedDocument::class);
    }

    /**
     * Only the latest generated version of each document type.
     */
    public function latestGeneratedDocuments()
    {
        return $this->generatedDocuments->sortByDesc('version')->unique('type')->values();
    }

    public function signature(): HasOne
    {
        return $this->hasOne(Signature::class);
    }

    public function emailLogs(): HasMany
    {
        return $this->hasMany(EmailLog::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isTokenValid(): bool
    {
        return $this->token_expires_at === null || $this->token_expires_at->isFuture();
    }
}
