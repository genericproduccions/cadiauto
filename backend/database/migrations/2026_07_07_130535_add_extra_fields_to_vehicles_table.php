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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('environmental_label')->nullable()->after('fuel');
            $table->string('previous_use')->nullable()->after('environmental_label');
            $table->boolean('has_liens')->default(false)->after('previous_use');
            $table->unsignedInteger('first_service_km')->nullable()->after('last_maintenance_km');
            $table->unsignedSmallInteger('first_service_months')->nullable()->after('first_service_km');
            $table->unsignedInteger('subsequent_service_km')->nullable()->after('first_service_months');
            $table->unsignedSmallInteger('subsequent_service_months')->nullable()->after('subsequent_service_km');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'environmental_label',
                'previous_use',
                'has_liens',
                'first_service_km',
                'first_service_months',
                'subsequent_service_km',
                'subsequent_service_months',
            ]);
        });
    }
};
