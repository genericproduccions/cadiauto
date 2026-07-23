<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ClientAccountService
{
    /**
     * Ensure the client has a linked login account (role "client"), so they can
     * sign in and see the list of all their deliveries. The default password is
     * the client's own NIF/DNI — documented for the dealer, and meant to be
     * changed by the client on their first login in a future iteration.
     */
    public static function syncLoginAccount(Client $client): ?User
    {
        if (empty($client->email)) {
            return null;
        }

        $user = User::where('client_id', $client->id)->first();

        if ($user) {
            $user->update(['name' => $client->full_name, 'email' => $client->email]);

            return $user;
        }

        return User::create([
            'name' => $client->full_name,
            'email' => $client->email,
            'password' => Hash::make(self::defaultPassword($client)),
            'role' => UserRole::Client,
            'client_id' => $client->id,
            'active' => true,
        ]);
    }

    public static function defaultPassword(Client $client): string
    {
        return strtoupper(preg_replace('/\s+/', '', $client->nif));
    }
}
