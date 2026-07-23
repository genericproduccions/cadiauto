<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\DeliveryStatus;
use App\Enums\GeneratedDocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSignatureRequest;
use App\Models\Delivery;
use App\Models\DeliveryDocument;
use App\Models\DeliveryPhoto;
use App\Models\GeneratedDocument;
use App\Services\AuditLogger;
use App\Services\DeliveryMailService;
use App\Services\PdfGeneratorService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ClientDeliveryController extends Controller
{
    public function __construct(
        private PdfGeneratorService $pdfGenerator,
        private DeliveryMailService $mailService,
    ) {}

    private function resolveDelivery(string $token): Delivery
    {
        $delivery = Delivery::where('access_token', $token)->firstOrFail();

        abort_unless($delivery->isTokenValid(), 410, 'Aquest enllaç ha caducat.');

        return $delivery;
    }

    public function show(string $token)
    {
        $delivery = $this->resolveDelivery($token)->load([
            'client', 'vehicle', 'salesperson', 'checkItems', 'photos', 'generatedDocuments', 'signature',
        ]);
        $delivery->setRelation('generatedDocuments', $delivery->latestGeneratedDocuments());

        if (! $delivery->client_viewed_at) {
            $delivery->update(['client_viewed_at' => now()]);
            AuditLogger::log('client_access', "El client ha accedit a l'entrega #{$delivery->id}.", $delivery);
        }

        return response()->json($delivery);
    }

    public function photo(string $token, DeliveryPhoto $photo)
    {
        $delivery = $this->resolveDelivery($token);

        abort_unless($photo->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($photo->path);
    }

    public function document(string $token, DeliveryDocument $document)
    {
        $delivery = $this->resolveDelivery($token);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path, $document->original_name);
    }

    public function generatedDocument(string $token, GeneratedDocument $document)
    {
        $delivery = $this->resolveDelivery($token);

        abort_unless($document->delivery_id === $delivery->id, 404);

        return Storage::disk('local')->response($document->path);
    }

    public function sign(StoreSignatureRequest $request, string $token)
    {
        $delivery = $this->resolveDelivery($token);

        abort_if($delivery->signature, 409, 'Aquesta entrega ja ha estat signada.');

        [, $base64Data] = explode(',', $request->validated('signature_image'), 2);
        $path = "deliveries/{$delivery->id}/signature.png";
        Storage::disk('local')->put($path, base64_decode($base64Data));

        DB::transaction(function () use ($delivery, $request, $path, $token) {
            $delivery->signature()->create([
                'image_path' => $path,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'signed_at' => now(),
                'access_token_used' => $token,
                'legal_acceptance' => true,
            ]);

            $delivery->update(['status' => DeliveryStatus::Signed]);
        });

        AuditLogger::log('delivery_signed', "El client ha signat l'entrega #{$delivery->id}.", $delivery);

        foreach (GeneratedDocumentType::cases() as $type) {
            $this->pdfGenerator->generate($delivery, $type);
        }

        $freshDelivery = $delivery->fresh(['client', 'vehicle', 'salesperson', 'generatedDocuments']);
        $freshDelivery->setRelation('generatedDocuments', $freshDelivery->latestGeneratedDocuments());

        $this->mailService->sendSignedDeliveryEmails($freshDelivery);

        $delivery->update(['status' => DeliveryStatus::Completed, 'completed_at' => now()]);

        AuditLogger::log('delivery_completed', "Entrega #{$delivery->id} finalitzada.", $delivery);

        return response()->json($delivery->fresh(['client', 'vehicle', 'signature']));
    }
}
