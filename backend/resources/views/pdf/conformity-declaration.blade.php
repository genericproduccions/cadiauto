<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    @include('pdf.partials.styles')
</head>
<body>
    @include('pdf.partials.header', ['documentTitle' => 'Declaració de conformitat'])

    <h1>Declaració de conformitat</h1>

    @include('pdf.partials.client-vehicle')

    <h2>Declaració</h2>
    <p class="legal-text">
        El client <strong>{{ $delivery->client->full_name }}</strong> declara que, en el moment de l'entrega del vehicle
        descrit anteriorment, ha revisat el seu estat general, la seva documentació i els seus accessoris, i que ho troba
        tot conforme amb el que s'ha acordat amb {{ $company['trade_name'] }}, sense reserves llevat de les que, si escau,
        es detallin a continuació.
    </p>

    <h2>Reserves / Observacions</h2>
    <p class="legal-text">{{ $delivery->observations ?: 'Sense observacions.' }}</p>

    <h2>Resum de l'estat del vehicle</h2>
    <table class="grid-2">
        @foreach ($delivery->checkItems->groupBy('category') as $category => $items)
            <tr>
                <td colspan="2" class="checklist-category">{{ $category }}</td>
            </tr>
            @foreach ($items as $item)
                <tr>
                    <td>{{ $item->item_name }}</td>
                    <td class="status-{{ $item->status?->value ?? 'not_applicable' }}">
                        {{ $item->status?->label() ?? 'No revisat' }}
                    </td>
                </tr>
            @endforeach
        @endforeach
    </table>

    @include('pdf.partials.signatures')
</body>
</html>
