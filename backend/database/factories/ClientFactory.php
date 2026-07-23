<?php

namespace Database\Factories;

use App\Enums\ClientType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'company_name' => null,
            'nif' => strtoupper(fake()->unique()->bothify('########?')),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->streetAddress(),
            'municipality' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'province' => 'Lleida',
            'type' => ClientType::Particular,
            'notes' => null,
        ];
    }

    public function empresa(): static
    {
        return $this->state(fn (array $attributes) => [
            'company_name' => fake()->company(),
            'type' => ClientType::Empresa,
        ]);
    }
}
