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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->restrictOnDelete();
            $table->foreignId('salesperson_id')->constrained('users')->restrictOnDelete();
            $table->dateTime('delivery_datetime')->nullable();
            $table->string('location')->nullable();
            $table->text('observations')->nullable();
            $table->enum('status', ['draft', 'pending_signature', 'signed', 'completed'])->default('draft');
            $table->string('access_token', 64)->unique();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamp('client_viewed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('access_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
