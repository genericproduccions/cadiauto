<?php

namespace Database\Seeders;

use App\Enums\CheckItemStatus;
use App\Enums\DeliveryStatus;
use App\Enums\VehicleStatus;
use App\Models\Client;
use App\Models\Delivery;
use App\Models\DeliveryCheckItem;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\ClientAccountService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Administrador Cadí Auto',
            'email' => 'admin@cadiauto.net',
        ]);

        $comercial1 = User::factory()->comercial()->create([
            'name' => 'Marc Comercial',
            'email' => 'comercial@cadiauto.net',
        ]);

        User::factory()->comercial()->create([
            'name' => 'Anna Vendes',
            'email' => 'anna@cadiauto.net',
        ]);

        $clients = Client::factory(8)->create();

        // Client de demostració amb credencials conegudes per provar l'àrea de client.
        $demoClient = $clients->first();
        $demoClient->update([
            'full_name' => 'Client de Demostració',
            'email' => 'client@cadiauto.net',
            'nif' => '12345678A',
        ]);
        ClientAccountService::syncLoginAccount($demoClient);

        $vehicles = Vehicle::factory(10)->create();

        // Entrega d'exemple en esborrany, amb checklist ja generada.
        $delivery = Delivery::factory()->create([
            'client_id' => $demoClient->id,
            'vehicle_id' => $vehicles->first()->id,
            'salesperson_id' => $comercial1->id,
            'status' => DeliveryStatus::Draft,
        ]);

        $vehicles->first()->update(['status' => VehicleStatus::Sold]);

        $sortOrder = 0;
        foreach (config('checklist') as $category => $items) {
            foreach ($items as $itemName) {
                DeliveryCheckItem::create([
                    'delivery_id' => $delivery->id,
                    'category' => $category,
                    'item_name' => $itemName,
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        // Segona entrega d'exemple, del mateix client de demostració, pendent de signatura.
        $delivery2 = Delivery::factory()->create([
            'client_id' => $demoClient->id,
            'vehicle_id' => $vehicles->get(1)->id,
            'salesperson_id' => $comercial1->id,
            'status' => DeliveryStatus::PendingSignature,
        ]);

        $vehicles->get(1)->update(['status' => VehicleStatus::Sold]);

        $sortOrder = 0;
        foreach (config('checklist') as $category => $items) {
            foreach ($items as $itemName) {
                DeliveryCheckItem::create([
                    'delivery_id' => $delivery2->id,
                    'category' => $category,
                    'item_name' => $itemName,
                    'status' => CheckItemStatus::Correct,
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        $this->command->info('Usuaris de prova:');
        $this->command->info('  Admin:     admin@cadiauto.net / password');
        $this->command->info('  Comercial: comercial@cadiauto.net / password');
        $this->command->info('  Client:    client@cadiauto.net / 12345678A');
        $this->command->info("Enllaç privat entrega pendent de signatura: /entrega/{$delivery2->access_token}");
    }
}
