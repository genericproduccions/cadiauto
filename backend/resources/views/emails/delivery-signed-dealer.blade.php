<x-mail::message>
# Entrega #{{ $delivery->id }} signada

**Client:** {{ $delivery->client->full_name }} ({{ $delivery->client->nif }})<br>
**Vehicle:** {{ $delivery->vehicle->brand }} {{ $delivery->vehicle->model }} — {{ $delivery->vehicle->plate }}<br>
**Comercial:** {{ $delivery->salesperson->name }}<br>
**Data de signatura:** {{ optional($delivery->signature)->signed_at?->format('d/m/Y H:i') }}

El client ha revisat i signat digitalment tota la documentació de l'entrega. S'adjunta còpia dels documents generats.

{{ $company['trade_name'] }}
</x-mail::message>
