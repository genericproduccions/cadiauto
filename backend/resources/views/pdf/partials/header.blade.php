<div class="header">
    <table>
        <tr>
            <td style="width: 60%;">
                <div class="company">{{ $company['trade_name'] }}</div>
                <div class="small">{{ $company['name'] }} &middot; NIF: {{ $company['nif'] }}</div>
                <div class="small">{{ $company['address'] }}, {{ $company['postal_code'] }} {{ $company['municipality'] }} ({{ $company['province'] }})</div>
                <div class="small">{{ $company['phone'] }} &middot; {{ $company['email'] }} &middot; {{ $company['website'] }}</div>
            </td>
            <td style="width: 40%;" class="doc-title">
                {{ $documentTitle }}<br>
                <span class="small">Entrega #{{ $delivery->id }} &middot; {{ now()->format('d/m/Y') }}</span>
            </td>
        </tr>
    </table>
</div>
<div class="footer">
    {{ $company['trade_name'] }} — {{ $documentTitle }} — Entrega #{{ $delivery->id }}
</div>
