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
		<th class="th-cell">PGS ID & Study</th>
		<th class="th-right">CCPM Variants</th>
		<th class="th-right">Meta OR (95% CI)</th>
		<th class="th-right">P-Value</th>
		<th class="th-right">I²</th>
		<th class="th-right">AUC</th>
	{/snippet}

	{#snippet tableRow(row)}
		<td class="px-3 py-2" onclick={(e) => e.stopPropagation()}>
			<button
				class="id-link hover:text-primary-900 transition-colors text-left"
				title="Search as this PGS"
				onclick={() => onCrossLink(row.pgsId)}
			>
				{row.pgsId}
			</button>
			<div class="text-neutral-500 text-xs leading-tight">{row.study}</div>
		</td>
		<td class="td-num">{formatNumber(row.ccpmVariants)}</td>
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
