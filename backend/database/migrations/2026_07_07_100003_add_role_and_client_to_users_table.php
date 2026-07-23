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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'comercial', 'client'])->default('comercial')->after('email');
            $table->foreignId('client_id')->nullable()->after('role')->constrained('clients')->nullOnDelete();
            $table->string('phone')->nullable()->after('client_id');
            $table->boolean('active')->default(true)->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
            $table->dropColumn(['role', 'phone', 'active']);
        });
    }
};
