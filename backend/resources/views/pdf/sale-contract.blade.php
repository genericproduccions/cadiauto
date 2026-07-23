<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    @include('pdf.partials.styles')
</head>
<body>
    @include('pdf.partials.header', ['documentTitle' => 'Contracte de compravenda de vehicle'])

    <h1>Contracte de compravenda de vehicle</h1>

    @include('pdf.partials.client-vehicle')

    <h2>Condicions de la compravenda</h2>
    <p class="legal-text">
        D'una banda, <strong>{{ $company['name'] }}</strong> ({{ $company['trade_name'] }}), amb NIF {{ $company['nif'] }}
        i domicili a {{ $company['address'] }}, {{ $company['municipality'] }}, com a part venedora, i de l'altra,
        <strong>{{ $delivery->client->full_name }}</strong>, amb DNI/NIF/NIE {{ $delivery->client->nif }}, com a part compradora,
        acorden la compravenda del vehicle descrit anteriorment, sota les condicions següents:
    </p>
    <p class="legal-text">
        1. El venedor lliura i el comprador adquireix el vehicle descrit, pel preu de
        <strong>{{ number_format($delivery->vehicle->sale_price, 2, ',', '.') }} €</strong>, impostos inclosos, que el comprador
        declara haver satisfet en la forma acordada entre les parts.
    </p>
    <p class="legal-text">
        2. El vehicle es lliura amb la documentació, l'estat i els accessoris que consten a l'acta d'estat del vehicle i als
        annexos adjunts a aquest contracte, que el comprador declara haver revisat i acceptat.
    </p>
    <p class="legal-text">
        3. El vehicle disposa d'una garantia de {{ $delivery->vehicle->warranty_months }} mesos des de la data d'entrega,
        d'acord amb les condicions especificades a l'annex de garantia adjunt.
    </p>
    <p class="legal-text">
        4. El comprador es fa responsable de tramitar el canvi de titularitat del vehicle davant els organismes
        corresponents, així com de l'assegurança obligatòria, a partir de la data d'entrega.
    </p>
    <p class="legal-text">
        5. Ambdues parts signen aquest contracte en prova de conformitat amb tot el que s'hi exposa.
    </p>

    @if ($delivery->observations)
        <h2>Observacions</h2>
        <p class="legal-text">{{ $delivery->observations }}</p>
    @endif

    @include('pdf.partials.signatures')
</body>
</html>
