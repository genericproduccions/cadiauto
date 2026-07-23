<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Delivery;
use App\Models\User;

class DeliveryPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function view(User $user, Delivery $delivery): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function update(User $user, Delivery $delivery): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function delete(User $user, Delivery $delivery): bool
    {
        return $user->role === UserRole::Admin;
    }
}
