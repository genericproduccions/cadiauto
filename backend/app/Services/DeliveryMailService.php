<?php

namespace App\Services;

use App\Enums\EmailRecipientType;
use App\Mail\DeliverySignedClientMail;
use App\Mail\DeliverySignedDealerMail;
use App\Models\Delivery;
use Illuminate\Support\Facades\Mail;

class DeliveryMailService
{
    public function sendSignedDeliveryEmails(Delivery $delivery): void
    {
        $this->sendAndLog(
            $delivery,
            EmailRecipientType::Client,
            $delivery->client->email,
            fn () => new DeliverySignedClientMail($delivery),
        );

        $this->sendAndLog(
            $delivery,
            EmailRecipientType::Dealer,
            config('cadiauto.company.email'),
            fn () => new DeliverySignedDealerMail($delivery),
        );
    }

    private function sendAndLog(Delivery $delivery, EmailRecipientType $recipientType, ?string $recipientEmail, callable $mailableFactory): void
    {
        if (empty($recipientEmail)) {
            return;
        }

        $mailable = $mailableFactory();

        try {
            Mail::to($recipientEmail)->send($mailable);

            $delivery->emailLogs()->create([
                'recipient_type' => $recipientType,
                'recipient_email' => $recipientEmail,
                'subject' => $mailable->envelope()->subject,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $delivery->emailLogs()->create([
                'recipient_type' => $recipientType,
                'recipient_email' => $recipientEmail,
                'subject' => $mailable->envelope()->subject,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'sent_at' => now(),
            ]);
        }
    }
}
