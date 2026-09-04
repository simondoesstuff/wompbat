<script lang="ts">
	import AssociationsTable from './AssociationsTable.svelte';
	import { formatOR, formatPValue, formatI2, formatNumber } from '$lib/utils';
	import { PGS_EXPORT_HEADERS } from '$lib/constants';
	import type { PgsRow } from '$lib/types';

	interface Props {
		rows: PgsRow[];
		selectedRow: PgsRow | null;
		onSelect: (row: PgsRow) => void;
		lowHeterogeneity: boolean;
		onLowHeterogeneityChange: (v: boolean) => void;
		onCrossLink: (pgsId: string) => void;
	}
	let { rows, selectedRow, onSelect, lowHeterogeneity, onLowHeterogeneityChange, onCrossLink }: Props = $props();
</script>

<AssociationsTable
	title="Top Associated Polygenic Scores"
	{rows}
	{onSelect}
	isRowSelected={(row) => selectedRow?.pgsId === row.pgsId && selectedRow?.study === row.study}
	{lowHeterogeneity}
	{onLowHeterogeneityChange}
	exportFilename="pgs_associations.tsv"
	exportHeaders={[...PGS_EXPORT_HEADERS]}
	getExportRow={(r) => [r.pgsId, r.study, r.ccpmVariants, r.metaOR, r.ciLower, r.ciUpper, r.pValue, r.i2, r.auc]}
	entityLabel="models"
>
	{#snippet columnHeaders()}
		<th class="px-3 py-2 font-semibold">PGS ID & Study</th>
		<th class="px-3 py-2 font-semibold text-right">CCPM Variants</th>
		<th class="px-3 py-2 font-semibold text-right">Meta OR (95% CI)</th>
		<th class="px-3 py-2 font-semibold text-right">P-Value</th>
		<th class="px-3 py-2 font-semibold text-right">I²</th>
		<th class="px-3 py-2 font-semibold text-right">AUC</th>
	{/snippet}

	{#snippet tableRow(row)}
		<td class="px-3 py-2" onclick={(e) => e.stopPropagation()}>
			<button
				class="font-mono font-semibold text-primary-700 hover:underline hover:text-primary-900 transition-colors text-left"
				title="Search as this PGS"
				onclick={() => onCrossLink(row.pgsId)}
			>
				{row.pgsId}
			</button>
			<div class="text-neutral-500 text-xs leading-tight">{row.study}</div>
		</td>
		<td class="px-3 py-2 text-right font-mono text-neutral-700">
			{formatNumber(row.ccpmVariants)}
		</td>
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
	{/snippet}
</AssociationsTable>
