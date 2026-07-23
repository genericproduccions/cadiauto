<h2>Signatures</h2>
<table>
    <tr>
        <td style="width: 50%;">
            <div class="signature-box">
                <div class="label">Pel concessionari — {{ $company['trade_name'] }}</div>
                <div class="value">{{ $delivery->salesperson->name }}</div>
                <div class="small">{{ $delivery->location ?? $company['municipality'] }}, {{ optional($delivery->delivery_datetime)->format('d/m/Y') ?? now()->format('d/m/Y') }}</div>
            </div>
        </td>
        <td style="width: 50%;">
            <div class="signature-box">
                <div class="label">Pel client — {{ $delivery->client->full_name }}</div>
                @if ($delivery->signature)
                    <img src="{{ storage_path('app/private/'.$delivery->signature->image_path) }}" alt="Signatura">
                    <div class="small">Signat electrònicament el {{ $delivery->signature->signed_at->format('d/m/Y H:i') }}</div>
                @else
                    <div class="small">Pendent de signatura</div>
                @endif
            </div>
        </td>
    </tr>
</table>
