<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    @include('pdf.partials.styles')
</head>
<body>
    @include('pdf.partials.header', ['documentTitle' => 'Annex de garantia'])

    <h1>Annex de garantia del vehicle</h1>

    @include('pdf.partials.client-vehicle')

    <h2>Condicions de la garantia</h2>
    <p class="legal-text">
        {{ $company['trade_name'] }} garanteix el vehicle descrit anteriorment durant un període de
        <strong>{{ $delivery->vehicle->warranty_months }} mesos</strong> a comptar des de la data d'entrega,
        d'acord amb les condicions següents:
    </p>
    <p class="legal-text">
        1. La garantia cobreix les avaries mecàniques i elèctriques derivades d'un defecte de fabricació o d'un
        funcionament anormal dels components principals del vehicle (motor, caixa de canvis, transmissió, sistema
        elèctric), sempre que no siguin conseqüència d'un mal ús, manteniment inadequat o desgast normal.
    </p>
    <p class="legal-text">
        2. Queden expressament exclosos de la garantia els elements de desgast (pastilles i discos de fre, pneumàtics,
        embragatge, escombretes, filtres, líquids) i els danys derivats d'accidents, negligència o modificacions no
        autoritzades.
    </p>
    <p class="legal-text">
        3. Per fer efectiva la garantia, el client haurà de posar-se en contacte amb {{ $company['trade_name'] }} el més
        aviat possible des de la detecció de l'avaria, i seguir el manteniment periòdic recomanat pel fabricant.
    </p>
    <p class="legal-text">
        4. Aquesta garantia s'entén complementària a la garantia legal de conformitat que correspongui d'acord amb la
        normativa vigent de protecció de consumidors i usuaris.
    </p>

    @include('pdf.partials.signatures')
</body>
</html>
