<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Vehicle;

class VehiclePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function view(User $user, Vehicle $vehicle): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function update(User $user, Vehicle $vehicle): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->role === UserRole::Admin;
    }
}
