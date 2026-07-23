<?php

namespace App\Models;

use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'version',
        'plate',
        'vin',
        'color',
        'fuel',
        'environmental_label',
        'previous_use',
        'has_liens',
        'mileage',
        'first_registration_date',
        'last_itv_date',
        'last_maintenance_date',
        'last_maintenance_km',
        'first_service_km',
        'first_service_months',
        'subsequent_service_km',
        'subsequent_service_months',
        'sale_price',
        'new_value',
        'used_value',
        'warranty_months',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'first_registration_date' => 'date',
            'last_itv_date' => 'date',
            'last_maintenance_date' => 'date',
            'sale_price' => 'decimal:2',
            'new_value' => 'decimal:2',
            'used_value' => 'decimal:2',
            'has_liens' => 'boolean',
            'status' => VehicleStatus::class,
        ];
    }

    protected $appends = ['depreciation_amount', 'depreciation_percentage'];

    protected function depreciationAmount(): Attribute
    {
        return Attribute::get(function () {
            if ($this->new_value === null || $this->used_value === null) {
                return null;
            }

            return round((float) $this->new_value - (float) $this->used_value, 2);
        });
    }

    protected function depreciationPercentage(): Attribute
    {
        return Attribute::get(function () {
            if ($this->new_value === null || $this->used_value === null || (float) $this->new_value <= 0) {
                return null;
            }

            return round((((float) $this->new_value - (float) $this->used_value) / (float) $this->new_value) * 100, 2);
        });
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    public function fullName(): string
    {
        return trim("{$this->brand} {$this->model} {$this->version}");
    }
}
