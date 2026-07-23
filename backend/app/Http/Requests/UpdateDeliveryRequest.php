<?php

namespace App\Http\Requests;

use App\Enums\DeliveryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeliveryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('delivery')) ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', Rule::exists('clients', 'id')],
            'vehicle_id' => ['required', Rule::exists('vehicles', 'id')],
            'salesperson_id' => ['required', Rule::exists('users', 'id')],
            'delivery_datetime' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'observations' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(DeliveryStatus::class)],
        ];
    }
}
