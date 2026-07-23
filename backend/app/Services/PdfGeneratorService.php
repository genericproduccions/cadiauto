<?php

namespace App\Services;

use App\Enums\GeneratedDocumentType;
use App\Models\Delivery;
use App\Models\GeneratedDocument;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfGeneratorService
{
    public function generate(Delivery $delivery, GeneratedDocumentType $type): GeneratedDocument
    {
        $delivery->loadMissing(['client', 'vehicle', 'salesperson', 'checkItems', 'photos', 'signature']);

        $pdf = Pdf::loadView($type->view(), [
            'delivery' => $delivery,
            'company' => config('cadiauto.company'),
            'documentTitle' => $type->label(),
        ])->setPaper('a4');

        $version = $delivery->generatedDocuments()->where('type', $type)->max('version') + 1;
        $fileName = "{$type->value}-v{$version}.pdf";
        $path = "deliveries/{$delivery->id}/generated/{$fileName}";

        Storage::disk('local')->put($path, $pdf->output());

        return $delivery->generatedDocuments()->create([
            'type' => $type,
            'path' => $path,
            'version' => $version,
            'generated_at' => now(),
        ]);
    }

    public function generateAll(Delivery $delivery): array
    {
        return array_map(
            fn (GeneratedDocumentType $type) => $this->generate($delivery, $type),
            GeneratedDocumentType::cases()
        );
    }
}
