<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case Available = 'available';
    case Sold = 'sold';
    case Delivered = 'delivered';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Disponible',
            self::Sold => 'Venut',
            self::Delivered => 'Entregat',
        };
    }
}
