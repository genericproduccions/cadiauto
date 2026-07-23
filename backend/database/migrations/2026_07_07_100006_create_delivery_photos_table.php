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
        Schema::create('delivery_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->enum('type', [
                'front', 'rear', 'left_side', 'right_side', 'interior',
                'dashboard', 'mileage', 'wheels', 'damage', 'other',
            ]);
            $table->string('path');
            $table->string('caption')->nullable();
            $table->timestamps();

            $table->index(['delivery_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_photos');
    }
};
