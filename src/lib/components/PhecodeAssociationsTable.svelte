<script lang="ts">
	import AssociationsTable from './AssociationsTable.svelte';
	import { formatOR, formatPValue, formatI2, formatPrevalence } from '$lib/utils';
	import { PHECODE_EXPORT_HEADERS } from '$lib/constants';
	import type { PhecodeRow } from '$lib/types';

	interface Props {
		rows: PhecodeRow[];
		selectedRow: PhecodeRow | null;
		onSelect: (row: PhecodeRow) => void;
		lowHeterogeneity: boolean;
		onLowHeterogeneityChange: (v: boolean) => void;
	}
	let { rows, selectedRow, onSelect, lowHeterogeneity, onLowHeterogeneityChange }: Props = $props();
</script>

<AssociationsTable
	title="Top Associated Phecodes"
	{rows}
	{onSelect}
	isRowSelected={(row) => selectedRow?.phecodeId === row.phecodeId}
	{lowHeterogeneity}
	{onLowHeterogeneityChange}
	exportFilename="phecode_associations.tsv"
	exportHeaders={[...PHECODE_EXPORT_HEADERS]}
	getExportRow={(r) => [r.phecodeId, r.phenotypeName, r.metaOR, r.ciLower, r.ciUpper, r.pValue, r.i2, r.auc, r.prevalence]}
	entityLabel="phecodes"
>
	{#snippet columnHeaders()}
		<th class="px-3 py-2 font-semibold">Phecode</th>
		<th class="px-3 py-2 font-semibold">Phenotype Name</th>
		<th class="px-3 py-2 font-semibold text-right">Meta OR (95% CI)</th>
		<th class="px-3 py-2 font-semibold text-right">P-Value</th>
		<th class="px-3 py-2 font-semibold text-right">I²</th>
		<th class="px-3 py-2 font-semibold text-right">AUC</th>
		<th class="px-3 py-2 font-semibold text-right">Prevalence</th>
	{/snippet}

	{#snippet tableRow(row)}
		<td class="px-3 py-2 font-mono font-semibold text-primary-700">{row.phecodeId}</td>
		<td class="px-3 py-2 text-fg max-w-48">{row.phenotypeName}</td>
		<td class="px-3 py-2 text-right font-mono text-neutral-700">
			{formatOR(row.metaOR, row.ciLower, row.ciUpper)}
		</td>
		<td class="px-3 py-2 text-right font-mono text-neutral-700">
			{formatPValue(row.pValue)}
		</td>
		<td
			class="px-3 py-2 text-right font-mono"
			class:text-neutral-400={row.i2 < 40}
			class:text-failure-600={row.i2 >= 40}
		>
			{formatI2(row.i2)}
		</td>
		<td class="px-3 py-2 text-right font-mono text-neutral-700">{row.auc.toFixed(3)}</td>
		<td class="px-3 py-2 text-right font-mono text-neutral-700">
			{formatPrevalence(row.prevalence)}
		</td>
	{/snippet}
</AssociationsTable>
