<?php

namespace App\Enums;

enum PhotoType: string
{
    case Front = 'front';
    case Rear = 'rear';
    case LeftSide = 'left_side';
    case RightSide = 'right_side';
    case Interior = 'interior';
    case Dashboard = 'dashboard';
    case Mileage = 'mileage';
    case Wheels = 'wheels';
    case Damage = 'damage';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Front => 'Vista frontal',
            self::Rear => 'Vista posterior',
            self::LeftSide => 'Lateral esquerre',
            self::RightSide => 'Lateral dret',
            self::Interior => 'Interior',
            self::Dashboard => 'Quadre/salpicader',
            self::Mileage => 'Quilometratge',
            self::Wheels => 'Rodes',
            self::Damage => 'Danys concrets',
            self::Other => 'Altres',
        };
    }
}
