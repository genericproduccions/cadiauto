<?php

namespace App\Enums;

enum ClientType: string
{
    case Particular = 'particular';
    case Empresa = 'empresa';

    public function label(): string
    {
        return match ($this) {
            self::Particular => 'Particular',
            self::Empresa => 'Empresa',
        };
    }
}
