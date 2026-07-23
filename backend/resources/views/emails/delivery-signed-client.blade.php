<x-mail::message>
# Gràcies per confiar en {{ $company['trade_name'] }}

Hola {{ $delivery->client->full_name }},

L'entrega del teu vehicle **{{ $delivery->vehicle->brand }} {{ $delivery->vehicle->model }}** (matrícula
{{ $delivery->vehicle->plate }}) ha quedat registrada i signada correctament.

T'adjuntem tota la documentació generada: el contracte de compravenda, la declaració de conformitat, l'annex de
garantia i l'acta d'estat del vehicle.

Si tens qualsevol dubte, no dubtis a contactar amb nosaltres.

Gràcies,<br>
{{ $company['trade_name'] }}
</x-mail::message>
