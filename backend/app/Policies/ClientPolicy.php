<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function view(User $user, Client $client): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function update(User $user, Client $client): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Comercial]);
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->role === UserRole::Admin;
    }
}
