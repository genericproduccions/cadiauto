<?php

namespace Database\Factories;

use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = [
            'Volkswagen' => ['Golf', 'Polo', 'Tiguan'],
            'Seat' => ['Ibiza', 'León', 'Arona'],
            'Peugeot' => ['208', '308', '2008'],
            'Renault' => ['Clio', 'Megane', 'Captur'],
            'Toyota' => ['Yaris', 'Corolla', 'C-HR'],
        ];
        $brand = fake()->randomElement(array_keys($brands));
        $model = fake()->randomElement($brands[$brand]);
        $newValue = fake()->numberBetween(18000, 42000);
        $usedValue = (int) ($newValue * fake()->randomFloat(2, 0.55, 0.85));

        return [
            'brand' => $brand,
            'model' => $model,
            'version' => fake()->randomElement(['Business', 'Sport', 'Style', 'Advance', null]),
            'plate' => strtoupper(fake()->unique()->bothify('####???')),
            'vin' => strtoupper(fake()->unique()->bothify('VIN#################')),
            'color' => fake()->safeColorName(),
            'fuel' => fake()->randomElement(['Gasolina', 'Dièsel', 'Híbrid', 'Elèctric']),
            'environmental_label' => fake()->randomElement(['ECO', 'C', 'B', null]),
            'previous_use' => fake()->randomElement(['Particular', 'Empresa', 'Rent a car', null]),
            'has_liens' => false,
            'mileage' => fake()->numberBetween(5000, 150000),
            'first_registration_date' => fake()->dateTimeBetween('-8 years', '-1 year'),
            'last_itv_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'last_maintenance_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'last_maintenance_km' => fake()->numberBetween(5000, 140000),
            'first_service_km' => 15000,
            'first_service_months' => 12,
            'subsequent_service_km' => 20000,
            'subsequent_service_months' => 12,
            'sale_price' => $usedValue + fake()->numberBetween(200, 1500),
            'new_value' => $newValue,
            'used_value' => $usedValue,
            'warranty_months' => fake()->randomElement([6, 12, 24]),
            'status' => VehicleStatus::Available,
        ];
    }
}
