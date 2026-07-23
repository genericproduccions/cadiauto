<?php

namespace Database\Factories;

use App\Enums\DeliveryStatus;
use App\Models\Client;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Delivery>
 */
class DeliveryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'vehicle_id' => Vehicle::factory(),
            'salesperson_id' => User::factory()->comercial(),
            'delivery_datetime' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'location' => 'La Seu d\'Urgell',
            'observations' => null,
            'status' => DeliveryStatus::Draft,
        ];
    }
}
