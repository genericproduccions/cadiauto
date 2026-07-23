@php($client = $delivery->client)
@php($vehicle = $delivery->vehicle)

<h2>Dades del client</h2>
<table class="grid-2">
    <tr>
        <td>
            <div class="label">Nom / Raó social</div>
            <div class="value">{{ $client->full_name }}{{ $client->company_name ? ' ('.$client->company_name.')' : '' }}</div>
        </td>
        <td>
            <div class="label">DNI / NIF / NIE</div>
            <div class="value">{{ $client->nif }}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">Adreça</div>
            <div class="value">{{ $client->address }}, {{ $client->postal_code }} {{ $client->municipality }} ({{ $client->province }})</div>
        </td>
        <td>
            <div class="label">Contacte</div>
            <div class="value">{{ $client->phone }} &middot; {{ $client->email }}</div>
        </td>
    </tr>
</table>

<h2>Dades del vehicle</h2>
<table class="grid-2">
    <tr>
        <td>
            <div class="label">Marca / Model / Versió</div>
            <div class="value">{{ $vehicle->brand }} {{ $vehicle->model }} {{ $vehicle->version }}</div>
        </td>
        <td>
            <div class="label">Matrícula / Bastidor</div>
            <div class="value">{{ $vehicle->plate }} &middot; {{ $vehicle->vin }}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">Color / Combustible</div>
            <div class="value">{{ $vehicle->color }} &middot; {{ $vehicle->fuel }}</div>
        </td>
        <td>
            <div class="label">Quilòmetres</div>
            <div class="value">{{ number_format($vehicle->mileage, 0, ',', '.') }} km</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">1a matriculació / Última ITV</div>
            <div class="value">{{ optional($vehicle->first_registration_date)->format('d/m/Y') ?? '—' }} &middot; {{ optional($vehicle->last_itv_date)->format('d/m/Y') ?? '—' }}</div>
        </td>
        <td>
            <div class="label">Preu de venda</div>
            <div class="value">{{ number_format($vehicle->sale_price, 2, ',', '.') }} €</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">Garantia</div>
            <div class="value">{{ $vehicle->warranty_months }} mesos</div>
        </td>
        <td>
            <div class="label">Data i lloc d'entrega</div>
            <div class="value">{{ optional($delivery->delivery_datetime)->format('d/m/Y H:i') ?? '—' }} &middot; {{ $delivery->location ?? $company['municipality'] }}</div>
        </td>
    </tr>
</table>
