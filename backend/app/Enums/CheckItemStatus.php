<?php

namespace App\Enums;

enum CheckItemStatus: string
{
    case Correct = 'correct';
    case Review = 'review';
    case NotApplicable = 'not_applicable';

    public function label(): string
    {
        return match ($this) {
            self::Correct => 'Correcte',
            self::Review => 'Revisar',
            self::NotApplicable => 'No té',
        };
    }
}
