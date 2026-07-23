<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    @include('pdf.partials.styles')
</head>
<body>
    @include('pdf.partials.header', ['documentTitle' => 'Comanda de vehicle usat'])

    <h1>Comanda de client — Vehicle usat</h1>

    @include('pdf.partials.client-vehicle')

    <h2>Detall de la comanda</h2>
    <table class="grid-2">
        <tr>
            <td>
                <div class="label">Preu de venda</div>
                <div class="value">{{ number_format($delivery->vehicle->sale_price, 2, ',', '.') }} €</div>
            </td>
            <td>
                <div class="label">Comercial responsable</div>
                <div class="value">{{ $delivery->salesperson->name }}</div>
            </td>
        </tr>
    </table>

    <p class="legal-text">
        El client <strong>{{ $delivery->client->full_name }}</strong> confirma la comanda del vehicle usat descrit
        anteriorment a {{ $company['trade_name'] }}, sota les condicions generals de venda del concessionari i les
        particulars que es detallin en aquest document i als seus annexos (contracte de compravenda, declaració de
        conformitat i annex de garantia).
    </p>

    @if ($delivery->observations)
        <h2>Observacions</h2>
        <p class="legal-text">{{ $delivery->observations }}</p>
    @endif

    @include('pdf.partials.signatures')
</body>
</html>
