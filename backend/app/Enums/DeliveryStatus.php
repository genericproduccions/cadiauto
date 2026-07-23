<?php

namespace App\Enums;

enum DeliveryStatus: string
{
    case Draft = 'draft';
    case PendingSignature = 'pending_signature';
    case Signed = 'signed';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Esborrany',
            self::PendingSignature => 'Pendent de signatura',
            self::Signed => 'Signada',
            self::Completed => 'Finalitzada',
        };
    }
}
