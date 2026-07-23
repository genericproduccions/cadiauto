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
        Schema::create('delivery_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->enum('type', [
                'client_dni', 'technical_sheet', 'circulation_permit',
                'itv', 'external_warranty', 'other',
            ]);
            $table->string('path');
            $table->string('original_name')->nullable();
            $table->timestamps();

            $table->index(['delivery_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_documents');
    }
};
