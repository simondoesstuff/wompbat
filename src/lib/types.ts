export type Ancestry = 'EUR' | 'AMR' | 'AFR' | 'EAS' | 'CSA' | 'MLE' | 'Meta';

export interface AutocompleteItem {
	id: string;
	label: string;
}
export type PgsUnit = 'continuous' | 'thresholded';

export interface AncestryEffect {
	ancestry: Ancestry;
	or: number;
	ci_lower: number;
	ci_upper: number;
}

export interface AncestryStats {
	ancestry: Ancestry;
	cases: number;
	sample: number;
}

export interface PgsInfo {
	pgsId: string;
	corePhenotype: string;
	ccpmVariants: number;
	catalogUrl: string;
}

export interface PhecodeInfo {
	phecodeId: string;
	phenotypeName: string;
	domain: string;
	totalCases: number;
	totalSample: number;
}

export interface PhecodeRow {
	phecodeId: string;
	phenotypeName: string;
	metaOR: number;
	ciLower: number;
	ciUpper: number;
	pValue: number;
	i2: number;
	auc: number;
	prevalence: number;
	effects: AncestryEffect[];
	ancestryStats: AncestryStats[];
}

export interface PgsRow {
	pgsId: string;
	efoLabel: string;
	ccpmVariants: number;
	metaOR: number;
	ciLower: number;
	ciUpper: number;
	pValue: number;
	i2: number;
	auc: number;
	effects: AncestryEffect[];
}

export interface PgsSearchResult {
	info: PgsInfo;
	rows: PhecodeRow[];
	hasMore: boolean;
}

export interface PhecodeSearchResult {
	info: PhecodeInfo;
	rows: PgsRow[];
	ancestryStats: AncestryStats[];
	hasMore: boolean;
}
