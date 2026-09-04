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
		onCrossLink: (phecodeId: string) => void;
	}
	let { rows, selectedRow, onSelect, lowHeterogeneity, onLowHeterogeneityChange, onCrossLink }: Props = $props();
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
		<th class="th-cell">Phecode</th>
		<th class="th-cell">Phenotype Name</th>
		<th class="th-right">Meta OR (95% CI)</th>
		<th class="th-right">P-Value</th>
		<th class="th-right">I²</th>
		<th class="th-right">AUC</th>
		<th class="th-right">Prevalence</th>
	{/snippet}

	{#snippet tableRow(row)}
		<td class="px-3 py-2" onclick={(e) => e.stopPropagation()}>
			<button
				class="id-link hover:text-primary-900 transition-colors"
				title="Search as this phecode"
				onclick={() => onCrossLink(row.phecodeId)}
			>
				{row.phecodeId}
			</button>
		</td>
		<td class="px-3 py-2 text-fg max-w-48">{row.phenotypeName}</td>
		<td class="td-num">{formatOR(row.metaOR, row.ciLower, row.ciUpper)}</td>
		<td class="td-num">{formatPValue(row.pValue)}</td>
		<td
			class="px-3 py-2 text-right font-mono"
			class:text-neutral-400={row.i2 < 40}
			class:text-failure-600={row.i2 >= 40}
		>
			{formatI2(row.i2)}
		</td>
		<td class="td-num">{row.auc.toFixed(3)}</td>
		<td class="td-num">{formatPrevalence(row.prevalence)}</td>
	{/snippet}
</AssociationsTable>

<style lang="postcss">
	.th-cell {
		@apply px-3 py-2 font-semibold;
	}
	.th-right {
		@apply px-3 py-2 font-semibold text-right;
	}
	.td-num {
		@apply px-3 py-2 text-right font-mono text-neutral-700;
	}
	.id-link {
		@apply font-mono font-semibold text-primary-700 hover:underline;
	}
</style>
