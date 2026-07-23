<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->string('version')->nullable();
            $table->string('plate')->unique();
            $table->string('vin')->unique();
            $table->string('color')->nullable();
            $table->string('fuel')->nullable();
            $table->unsignedInteger('mileage')->default(0);
            $table->date('first_registration_date')->nullable();
            $table->date('last_itv_date')->nullable();
            $table->date('last_maintenance_date')->nullable();
            $table->unsignedInteger('last_maintenance_km')->nullable();
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->decimal('new_value', 10, 2)->nullable();
            $table->decimal('used_value', 10, 2)->nullable();
            $table->unsignedSmallInteger('warranty_months')->default(12);
            $table->enum('status', ['available', 'sold', 'delivered'])->default('available');
            $table->timestamps();

            $table->index('plate');
            $table->index('vin');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
