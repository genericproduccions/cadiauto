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
        Schema::create('generated_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->enum('type', [
                'sale_contract', 'conformity_declaration', 'warranty_annex',
                'used_vehicle_order', 'vehicle_status_report',
            ]);
            $table->string('path');
            $table->unsignedSmallInteger('version')->default(1);
            $table->timestamp('generated_at');
            $table->timestamps();

            $table->index(['delivery_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_documents');
    }
};
