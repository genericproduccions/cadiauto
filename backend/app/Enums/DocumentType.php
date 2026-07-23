<?php

namespace App\Enums;

enum DocumentType: string
{
    case ClientDni = 'client_dni';
    case TechnicalSheet = 'technical_sheet';
    case CirculationPermit = 'circulation_permit';
    case Itv = 'itv';
    case ExternalWarranty = 'external_warranty';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::ClientDni => 'DNI client',
            self::TechnicalSheet => 'Fitxa tècnica',
            self::CirculationPermit => 'Permís de circulació',
            self::Itv => 'ITV',
            self::ExternalWarranty => 'Contracte garantia extern',
            self::Other => 'Altres documents',
        };
    }
}
