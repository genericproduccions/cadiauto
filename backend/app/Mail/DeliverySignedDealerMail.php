<?php

namespace App\Mail;

use App\Models\Delivery;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DeliverySignedDealerMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Delivery $delivery) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Entrega #{$this->delivery->id} signada — {$this->delivery->vehicle->plate}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.delivery-signed-dealer',
            with: [
                'delivery' => $this->delivery,
                'company' => config('cadiauto.company'),
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return $this->delivery->generatedDocuments
            ->map(fn ($document) => Attachment::fromStorageDisk('local', $document->path)
                ->as($document->type->value.'.pdf')
                ->withMime('application/pdf'))
            ->all();
    }
}
