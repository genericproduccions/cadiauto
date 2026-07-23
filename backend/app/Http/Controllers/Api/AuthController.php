<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Auth::validate($credentials) || ! $user->active) {
            throw ValidationException::withMessages([
                'email' => ['Les credencials no són correctes.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        AuditLogger::log('login', "L'usuari {$user->email} ha iniciat sessió.", user: $user, request: $request);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        AuditLogger::log('logout', "L'usuari {$request->user()->email} ha tancat sessió.", request: $request);

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sessió tancada correctament.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('client'));
    }
}
