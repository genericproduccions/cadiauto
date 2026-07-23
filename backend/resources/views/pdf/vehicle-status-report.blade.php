<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    @include('pdf.partials.styles')
</head>
<body>
    @include('pdf.partials.header', ['documentTitle' => "Acta d'estat del vehicle"])

    <h1>Acta d'estat del vehicle</h1>

    @include('pdf.partials.client-vehicle')

    <h2>Checklist de revisió</h2>
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
                        @if ($item->comment)
                            <br><span class="small">{{ $item->comment }}</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        @endforeach
    </table>

    @if ($delivery->photos->isNotEmpty())
        <h2>Fotografies de l'entrega</h2>
        <div class="photos">
            @foreach ($delivery->photos as $photo)
                <img src="{{ storage_path('app/private/'.$photo->path) }}" alt="{{ $photo->type->label() }}">
            @endforeach
        </div>
    @endif

    @if ($delivery->observations)
        <h2>Observacions generals</h2>
        <p class="legal-text">{{ $delivery->observations }}</p>
    @endif

    @include('pdf.partials.signatures')
</body>
</html>
