<?php

namespace App\Http\Requests;

use App\Enums\CheckItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCheckItemsRequest extends FormRequest
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
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', Rule::exists('delivery_check_items', 'id')],
            'items.*.status' => ['nullable', Rule::enum(CheckItemStatus::class)],
            'items.*.comment' => ['nullable', 'string'],
        ];
    }
}
