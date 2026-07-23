<?php

namespace App\Http\Controllers\Api;

use App\Enums\GeneratedDocumentType;
use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\GeneratedDocument;
use App\Services\AuditLogger;
use App\Services\PdfGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class GeneratedDocumentController extends Controller
{
    public function __construct(private PdfGeneratorService $pdfGenerator) {}

    public function index(Delivery $delivery)
    {
        Gate::authorize('view', $delivery);

        return response()->json($delivery->latestGeneratedDocuments());
    }

    public function store(Request $request, Delivery $delivery)
    {
        Gate::authorize('update', $delivery);

        $request->validate([
            'type' => ['nullable', Rule::enum(GeneratedDocumentType::class)],
        ]);

        if ($request->filled('type')) {
            $this->pdfGenerator->generate($delivery, GeneratedDocumentType::from($request->string('type')->toString()));
        } else {
            $this->pdfGenerator->generateAll($delivery);
        }

        AuditLogger::log('pdf_generated', 'Documents PDF generats per a l\'entrega #'.$delivery->id.'.', $delivery, request: $request);

        return response()->json($delivery->fresh()->latestGeneratedDocuments(), 201);
    }

    public function show(Delivery $delivery, GeneratedDocument $document)
    {
        Gate::authorize('view', $delivery);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path);
    }
}
