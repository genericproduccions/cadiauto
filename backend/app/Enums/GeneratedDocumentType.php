<?php

namespace App\Enums;

enum GeneratedDocumentType: string
{
    case SaleContract = 'sale_contract';
    case ConformityDeclaration = 'conformity_declaration';
    case WarrantyAnnex = 'warranty_annex';
    case UsedVehicleOrder = 'used_vehicle_order';
    case VehicleStatusReport = 'vehicle_status_report';

    public function label(): string
    {
        return match ($this) {
            self::SaleContract => 'Contracte de compravenda',
            self::ConformityDeclaration => 'Declaració de conformitat',
            self::WarrantyAnnex => 'Annex de garantia',
            self::UsedVehicleOrder => 'Comanda de vehicle usat',
            self::VehicleStatusReport => 'Acta d\'estat del vehicle',
        };
    }

    public function view(): string
    {
        return match ($this) {
            self::SaleContract => 'pdf.sale-contract',
            self::ConformityDeclaration => 'pdf.conformity-declaration',
            self::WarrantyAnnex => 'pdf.warranty-annex',
            self::UsedVehicleOrder => 'pdf.used-vehicle-order',
            self::VehicleStatusReport => 'pdf.vehicle-status-report',
        };
    }
}
