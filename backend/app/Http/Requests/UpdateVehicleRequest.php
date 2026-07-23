<?php

namespace App\Http\Requests;

use App\Enums\VehicleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('vehicle')) ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $vehicleId = $this->route('vehicle')->id;

        return [
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'version' => ['nullable', 'string', 'max:255'],
            'plate' => ['required', 'string', 'max:20', Rule::unique('vehicles', 'plate')->ignore($vehicleId)],
            'vin' => ['required', 'string', 'max:50', Rule::unique('vehicles', 'vin')->ignore($vehicleId)],
            'color' => ['nullable', 'string', 'max:100'],
            'fuel' => ['nullable', 'string', 'max:100'],
            'environmental_label' => ['nullable', 'string', 'max:20'],
            'previous_use' => ['nullable', 'string', 'max:100'],
            'has_liens' => ['nullable', 'boolean'],
            'mileage' => ['nullable', 'integer', 'min:0'],
            'first_registration_date' => ['nullable', 'date'],
            'last_itv_date' => ['nullable', 'date'],
            'last_maintenance_date' => ['nullable', 'date'],
            'last_maintenance_km' => ['nullable', 'integer', 'min:0'],
            'first_service_km' => ['nullable', 'integer', 'min:0'],
            'first_service_months' => ['nullable', 'integer', 'min:0'],
            'subsequent_service_km' => ['nullable', 'integer', 'min:0'],
            'subsequent_service_months' => ['nullable', 'integer', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'new_value' => ['nullable', 'numeric', 'min:0'],
            'used_value' => ['nullable', 'numeric', 'min:0'],
            'warranty_months' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(VehicleStatus::class)],
        ];
    }
}
