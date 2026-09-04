export type Ancestry = 'EUR' | 'AMR' | 'AFR' | 'EAS' | 'SAS' | 'Meta';
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
	modelName: string;
	corePhenotype: string;
	ccpmVariants: number;
	catalogUrl: string;
}

export interface PhecodeInfo {
	phecodeId: string;
	phenotypeName: string;
	cohort: string;
	parentCategory: string;
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
	study: string;
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
}

export interface PhecodeSearchResult {
	info: PhecodeInfo;
	rows: PgsRow[];
	ancestryStats: AncestryStats[];
}
