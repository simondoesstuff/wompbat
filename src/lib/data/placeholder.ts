import type {
	AncestryEffect,
	AncestryStats,
	AutocompleteItem,
	PgsSearchResult,
	PhecodeSearchResult
} from '../types';

function effects(
	eur: [number, number, number],
	amr: [number, number, number],
	afr: [number, number, number],
	eas: [number, number, number],
	sas: [number, number, number],
	meta: [number, number, number]
): AncestryEffect[] {
	return [
		{ ancestry: 'EUR', or: eur[0], ci_lower: eur[1], ci_upper: eur[2] },
		{ ancestry: 'AMR', or: amr[0], ci_lower: amr[1], ci_upper: amr[2] },
		{ ancestry: 'AFR', or: afr[0], ci_lower: afr[1], ci_upper: afr[2] },
		{ ancestry: 'EAS', or: eas[0], ci_lower: eas[1], ci_upper: eas[2] },
		{ ancestry: 'SAS', or: sas[0], ci_lower: sas[1], ci_upper: sas[2] },
		{ ancestry: 'Meta', or: meta[0], ci_lower: meta[1], ci_upper: meta[2] }
	];
}

function stats(
	eurC: number,
	eurS: number,
	amrC: number,
	amrS: number,
	afrC: number,
	afrS: number,
	easC: number,
	easS: number,
	sasC: number,
	sasS: number
): AncestryStats[] {
	return [
		{ ancestry: 'EUR', cases: eurC, sample: eurS },
		{ ancestry: 'AMR', cases: amrC, sample: amrS },
		{ ancestry: 'AFR', cases: afrC, sample: afrS },
		{ ancestry: 'EAS', cases: easC, sample: easS },
		{ ancestry: 'SAS', cases: sasC, sample: sasS }
	];
}

export const pgsPlaceholder: PgsSearchResult = {
	info: {
		pgsId: 'PGS000018',
		modelName: 'Coronary Artery Disease',
		corePhenotype: 'Coronary artery disease / myocardial infarction',
		ccpmVariants: 6_432_190,
		catalogUrl: 'https://www.pgscatalog.org/score/PGS000018/'
	},
	rows: [
		{
			phecodeId: '411.4',
			phenotypeName: 'Coronary atherosclerosis',
			metaOR: 1.44,
			ciLower: 1.42,
			ciUpper: 1.5,
			pValue: 2.2e-184,
			i2: 18.2,
			auc: 0.741,
			prevalence: 18.8,
			effects: effects(
				[1.46, 1.38, 1.54],
				[1.26, 1.15, 1.42],
				[1.31, 1.18, 1.45],
				[1.39, 1.17, 1.64],
				[1.31, 1.17, 1.46],
				[1.31, 1.27, 1.36]
			),
			ancestryStats: stats(9208, 48702, 2672, 34208, 1634, 8698, 622, 7912, 639, 3488)
		},
		{
			phecodeId: '411.2',
			phenotypeName: 'Myocardial infarction',
			metaOR: 1.4,
			ciLower: 1.37,
			ciUpper: 1.47,
			pValue: 8.4e-122,
			i2: 36.9,
			auc: 0.724,
			prevalence: 9.2,
			effects: effects(
				[1.42, 1.35, 1.5],
				[1.22, 1.1, 1.38],
				[1.27, 1.12, 1.44],
				[1.35, 1.1, 1.66],
				[1.28, 1.12, 1.47],
				[1.28, 1.23, 1.33]
			),
			ancestryStats: stats(4482, 48702, 1288, 34208, 788, 8698, 287, 7912, 311, 3488)
		},
		{
			phecodeId: '413.3',
			phenotypeName: 'Angina pectoris',
			metaOR: 1.34,
			ciLower: 1.28,
			ciUpper: 1.48,
			pValue: 5.1e-44,
			i2: 12.8,
			auc: 0.685,
			prevalence: 6.5,
			effects: effects(
				[1.36, 1.27, 1.46],
				[1.18, 1.04, 1.34],
				[1.22, 1.06, 1.41],
				[1.28, 0.99, 1.65],
				[1.22, 1.05, 1.41],
				[1.22, 1.17, 1.28]
			),
			ancestryStats: stats(3172, 48702, 912, 34208, 556, 8698, 198, 7912, 218, 3488)
		},
		{
			phecodeId: '411.1',
			phenotypeName: 'Unstable angina',
			metaOR: 1.34,
			ciLower: 1.28,
			ciUpper: 1.48,
			pValue: 1.0e-64,
			i2: 12.0,
			auc: 0.685,
			prevalence: 6.5,
			effects: effects(
				[1.35, 1.26, 1.45],
				[1.17, 1.03, 1.33],
				[1.21, 1.05, 1.4],
				[1.27, 0.98, 1.64],
				[1.21, 1.04, 1.41],
				[1.21, 1.16, 1.27]
			),
			ancestryStats: stats(3172, 48702, 912, 34208, 556, 8698, 198, 7912, 218, 3488)
		},
		{
			phecodeId: '411.8',
			phenotypeName: 'Other acute ischemic heart disease',
			metaOR: 1.32,
			ciLower: 1.24,
			ciUpper: 1.42,
			pValue: 2.4e-51,
			i2: 8.6,
			auc: 0.672,
			prevalence: 5.1,
			effects: effects(
				[1.34, 1.24, 1.45],
				[1.15, 1.0, 1.32],
				[1.19, 1.02, 1.39],
				[1.25, 0.95, 1.65],
				[1.19, 1.01, 1.4],
				[1.19, 1.13, 1.25]
			),
			ancestryStats: stats(2494, 48702, 714, 34208, 436, 8698, 155, 7912, 171, 3488)
		},
		{
			phecodeId: '412.8',
			phenotypeName: 'Old myocardial infarction',
			metaOR: 1.38,
			ciLower: 1.31,
			ciUpper: 1.45,
			pValue: 6.7e-69,
			i2: 44.2,
			auc: 0.699,
			prevalence: 4.8,
			effects: effects(
				[1.41, 1.31, 1.52],
				[1.21, 1.06, 1.38],
				[1.25, 1.07, 1.45],
				[1.32, 1.0, 1.74],
				[1.25, 1.06, 1.47],
				[1.25, 1.19, 1.31]
			),
			ancestryStats: stats(2342, 48702, 670, 34208, 409, 8698, 145, 7912, 160, 3488)
		},
		{
			phecodeId: '414.8',
			phenotypeName: 'Chronic ischemic heart disease',
			metaOR: 1.33,
			ciLower: 1.26,
			ciUpper: 1.36,
			pValue: 8.0e-88,
			i2: 12.3,
			auc: 0.669,
			prevalence: 8.8,
			effects: effects(
				[1.35, 1.26, 1.44],
				[1.15, 1.01, 1.31],
				[1.19, 1.03, 1.38],
				[1.26, 0.97, 1.64],
				[1.19, 1.02, 1.4],
				[1.19, 1.14, 1.25]
			),
			ancestryStats: stats(4298, 48702, 1231, 34208, 751, 8698, 267, 7912, 293, 3488)
		},
		{
			phecodeId: '413.8',
			phenotypeName: 'Ischemic heart disease, unspecified',
			metaOR: 1.27,
			ciLower: 1.21,
			ciUpper: 1.35,
			pValue: 1.5e-38,
			i2: 15.6,
			auc: 0.655,
			prevalence: 14.1,
			effects: effects(
				[1.29, 1.2, 1.38],
				[1.1, 0.96, 1.25],
				[1.14, 0.98, 1.32],
				[1.2, 0.91, 1.58],
				[1.14, 0.97, 1.33],
				[1.14, 1.09, 1.19]
			),
			ancestryStats: stats(6891, 48702, 1977, 34208, 1206, 8698, 429, 7912, 472, 3488)
		},
		{
			phecodeId: '428.1',
			phenotypeName: 'Congestive heart failure',
			metaOR: 1.25,
			ciLower: 1.19,
			ciUpper: 1.31,
			pValue: 8.2e-25,
			i2: 11.4,
			auc: 0.612,
			prevalence: 10.8,
			effects: effects(
				[1.27, 1.18, 1.36],
				[1.08, 0.94, 1.23],
				[1.12, 0.96, 1.3],
				[1.18, 0.89, 1.56],
				[1.12, 0.95, 1.31],
				[1.12, 1.07, 1.17]
			),
			ancestryStats: stats(5278, 48702, 1511, 34208, 922, 8698, 328, 7912, 361, 3488)
		},
		{
			phecodeId: '415.1',
			phenotypeName: 'Peripheral vascular disease',
			metaOR: 1.16,
			ciLower: 1.11,
			ciUpper: 1.21,
			pValue: 4.7e-19,
			i2: 21.0,
			auc: 0.598,
			prevalence: 7.1,
			effects: effects(
				[1.18, 1.09, 1.27],
				[1.0, 0.87, 1.15],
				[1.04, 0.88, 1.22],
				[1.09, 0.81, 1.47],
				[1.04, 0.87, 1.23],
				[1.04, 0.99, 1.09]
			),
			ancestryStats: stats(3473, 48702, 995, 34208, 607, 8698, 216, 7912, 238, 3488)
		},
		{
			phecodeId: '461.1',
			phenotypeName: 'Essential hypertension',
			metaOR: 1.14,
			ciLower: 1.11,
			ciUpper: 1.18,
			pValue: 2.3e-28,
			i2: 32.0,
			auc: 0.582,
			prevalence: 36.2,
			effects: effects(
				[1.16, 1.08, 1.24],
				[0.98, 0.85, 1.13],
				[1.01, 0.86, 1.19],
				[1.07, 0.8, 1.43],
				[1.01, 0.85, 1.2],
				[1.01, 0.97, 1.06]
			),
			ancestryStats: stats(17710, 48702, 5074, 34208, 3095, 8698, 1101, 7912, 1212, 3488)
		},
		{
			phecodeId: '420.1',
			phenotypeName: 'Atrial fibrillation and flutter',
			metaOR: 1.11,
			ciLower: 1.07,
			ciUpper: 1.16,
			pValue: 3.1e-15,
			i2: 5.3,
			auc: 0.571,
			prevalence: 8.4,
			effects: effects(
				[1.13, 1.05, 1.22],
				[0.96, 0.83, 1.11],
				[0.99, 0.84, 1.17],
				[1.05, 0.78, 1.41],
				[0.99, 0.83, 1.17],
				[0.99, 0.94, 1.04]
			),
			ancestryStats: stats(4111, 48702, 1178, 34208, 718, 8698, 256, 7912, 281, 3488)
		}
	]
};

export const pgsAutocompleteData: AutocompleteItem[] = [
	{ id: 'PGS000018', label: 'Coronary Artery Disease' },
	{ id: 'PGS000054', label: 'Type 2 Diabetes Mellitus — Mahajan et al. 2018' },
	{ id: 'PGS000036', label: 'Coronary Artery Disease — Khera et al. 2018' },
	{ id: 'PGS000854', label: 'Type 2 Diabetes Mellitus — Vujkovic et al. 2020' },
	{ id: 'PGS001002', label: 'Type 2 Diabetes Mellitus — Mars et al. 2020' },
	{ id: 'PGS000129', label: 'Type 2 Diabetes Mellitus — Suzuki et al. 2019' },
	{ id: 'PGS000711', label: 'Type 2 Diabetes Mellitus — Graham et al. 2021' },
	{ id: 'PGS001285', label: 'Type 2 Diabetes Mellitus — Mars et al. 2021' },
	{ id: 'PGS000492', label: 'Type 2 Diabetes Mellitus — Scott et al. 2021' },
	{ id: 'PGS001558', label: 'Type 2 Diabetes Mellitus — Chan et al. 2022' },
	{ id: 'PGS000398', label: 'Type 2 Diabetes Mellitus — Wessel et al. 2021' },
	{ id: 'PGS000722', label: 'Type 2 Diabetes Mellitus — Ritchie et al. 2021' }
];

export const phecodeAutocompleteData: AutocompleteItem[] = [
	{ id: '250.2', label: 'Type 2 diabetes mellitus' },
	{ id: '411.4', label: 'Coronary atherosclerosis' },
	{ id: '411.2', label: 'Myocardial infarction' },
	{ id: '413.3', label: 'Angina pectoris' },
	{ id: '411.1', label: 'Unstable angina' },
	{ id: '411.8', label: 'Other acute ischemic heart disease' },
	{ id: '412.8', label: 'Old myocardial infarction' },
	{ id: '414.8', label: 'Chronic ischemic heart disease' },
	{ id: '413.8', label: 'Ischemic heart disease, unspecified' },
	{ id: '428.1', label: 'Congestive heart failure' },
	{ id: '415.1', label: 'Peripheral vascular disease' },
	{ id: '461.1', label: 'Essential hypertension' },
	{ id: '420.1', label: 'Atrial fibrillation and flutter' }
];

export const phecodePlaceholder: PhecodeSearchResult = {
	info: {
		phecodeId: '250.2',
		phenotypeName: 'Type 2 diabetes mellitus',
		cohort: 'METABOLIC COHORT',
		parentCategory: 'Endocrine / Metabolic'
	},
	ancestryStats: [
		{ ancestry: 'EUR', cases: 3092, sample: 46158 },
		{ ancestry: 'AMR', cases: 1725, sample: 9920 },
		{ ancestry: 'AFR', cases: 916, sample: 5055 },
		{ ancestry: 'EAS', cases: 375, sample: 2335 },
		{ ancestry: 'SAS', cases: 175, sample: 1340 }
	],
	rows: [
		{
			pgsId: 'PGS000054',
			study: 'Mahajan et al. 2018',
			ccpmVariants: 6_521_119,
			metaOR: 1.38,
			ciLower: 1.35,
			ciUpper: 1.42,
			pValue: 1.2e-88,
			i2: 28.6,
			auc: 0.724,
			effects: effects(
				[1.41, 1.34, 1.48],
				[1.22, 1.09, 1.36],
				[1.26, 1.1, 1.44],
				[1.33, 1.01, 1.75],
				[1.26, 1.07, 1.48],
				[1.26, 1.2, 1.32]
			)
		},
		{
			pgsId: 'PGS000036',
			study: 'Khera et al. 2018',
			ccpmVariants: 6_990_025,
			metaOR: 1.34,
			ciLower: 1.31,
			ciUpper: 1.38,
			pValue: 4.8e-74,
			i2: 32.3,
			auc: 0.718,
			effects: effects(
				[1.37, 1.29, 1.45],
				[1.18, 1.05, 1.32],
				[1.22, 1.06, 1.4],
				[1.29, 0.97, 1.71],
				[1.22, 1.03, 1.44],
				[1.22, 1.16, 1.28]
			)
		},
		{
			pgsId: 'PGS000854',
			study: 'Vujkovic et al. 2020',
			ccpmVariants: 1_428_115,
			metaOR: 1.31,
			ciLower: 1.31,
			ciUpper: 1.36,
			pValue: 5.6e-69,
			i2: 35.1,
			auc: 0.713,
			effects: effects(
				[1.41, 1.34, 1.48],
				[1.22, 1.09, 1.37],
				[1.25, 1.09, 1.44],
				[1.29, 0.98, 1.7],
				[1.25, 1.06, 1.47],
				[1.31, 1.26, 1.37]
			)
		},
		{
			pgsId: 'PGS001002',
			study: 'Mars et al. 2020',
			ccpmVariants: 9_114_883,
			metaOR: 1.29,
			ciLower: 1.25,
			ciUpper: 1.34,
			pValue: 7.4e-45,
			i2: 21.8,
			auc: 0.698,
			effects: effects(
				[1.31, 1.24, 1.39],
				[1.13, 1.0, 1.27],
				[1.17, 1.02, 1.34],
				[1.23, 0.93, 1.63],
				[1.17, 0.99, 1.38],
				[1.17, 1.12, 1.22]
			)
		},
		{
			pgsId: 'PGS000129',
			study: 'Suzuki et al. 2019',
			ccpmVariants: 2_881_040,
			metaOR: 1.26,
			ciLower: 1.26,
			ciUpper: 1.31,
			pValue: 3.2e-38,
			i2: 38.5,
			auc: 0.689,
			effects: effects(
				[1.28, 1.21, 1.36],
				[1.1, 0.97, 1.24],
				[1.14, 0.99, 1.31],
				[1.2, 0.9, 1.6],
				[1.14, 0.96, 1.35],
				[1.14, 1.09, 1.19]
			)
		},
		{
			pgsId: 'PGS000711',
			study: 'Graham et al. 2021',
			ccpmVariants: 3_902_504,
			metaOR: 1.23,
			ciLower: 1.2,
			ciUpper: 1.27,
			pValue: 5.1e-30,
			i2: 44.2,
			auc: 0.675,
			effects: effects(
				[1.25, 1.18, 1.33],
				[1.08, 0.95, 1.22],
				[1.12, 0.96, 1.29],
				[1.17, 0.88, 1.56],
				[1.12, 0.94, 1.33],
				[1.12, 1.07, 1.17]
			)
		},
		{
			pgsId: 'PGS001285',
			study: 'Mars et al. 2021',
			ccpmVariants: 6_783_280,
			metaOR: 1.22,
			ciLower: 1.2,
			ciUpper: 1.26,
			pValue: 8.8e-28,
			i2: 19.8,
			auc: 0.675,
			effects: effects(
				[1.24, 1.17, 1.31],
				[1.07, 0.94, 1.21],
				[1.1, 0.95, 1.27],
				[1.16, 0.87, 1.54],
				[1.1, 0.93, 1.3],
				[1.1, 1.05, 1.15]
			)
		},
		{
			pgsId: 'PGS000492',
			study: 'Scott et al. 2021',
			ccpmVariants: 1_126_482,
			metaOR: 1.2,
			ciLower: 1.17,
			ciUpper: 1.24,
			pValue: 3.4e-24,
			i2: 36.0,
			auc: 0.669,
			effects: effects(
				[1.22, 1.14, 1.3],
				[1.05, 0.92, 1.19],
				[1.08, 0.93, 1.26],
				[1.14, 0.85, 1.53],
				[1.08, 0.91, 1.28],
				[1.08, 1.03, 1.13]
			)
		},
		{
			pgsId: 'PGS000129',
			study: 'Vujkovic et al. 2020',
			ccpmVariants: 5_224_778,
			metaOR: 1.17,
			ciLower: 1.14,
			ciUpper: 1.21,
			pValue: 4.2e-19,
			i2: 29.7,
			auc: 0.651,
			effects: effects(
				[1.19, 1.12, 1.27],
				[1.03, 0.9, 1.17],
				[1.06, 0.91, 1.23],
				[1.12, 0.83, 1.5],
				[1.06, 0.89, 1.25],
				[1.06, 1.01, 1.11]
			)
		},
		{
			pgsId: 'PGS001558',
			study: 'Chan et al. 2022',
			ccpmVariants: 5_224_998,
			metaOR: 1.16,
			ciLower: 1.14,
			ciUpper: 1.19,
			pValue: 1.5e-18,
			i2: 29.7,
			auc: 0.651,
			effects: effects(
				[1.18, 1.1, 1.26],
				[1.01, 0.88, 1.16],
				[1.05, 0.9, 1.22],
				[1.1, 0.82, 1.48],
				[1.05, 0.88, 1.24],
				[1.05, 1.0, 1.1]
			)
		},
		{
			pgsId: 'PGS000398',
			study: 'Wessel et al. 2021',
			ccpmVariants: 4_102_337,
			metaOR: 1.14,
			ciLower: 1.11,
			ciUpper: 1.17,
			pValue: 2.2e-15,
			i2: 18.4,
			auc: 0.642,
			effects: effects(
				[1.16, 1.09, 1.23],
				[1.0, 0.87, 1.14],
				[1.03, 0.88, 1.2],
				[1.08, 0.81, 1.45],
				[1.03, 0.86, 1.22],
				[1.03, 0.98, 1.08]
			)
		},
		{
			pgsId: 'PGS000722',
			study: 'Ritchie et al. 2021',
			ccpmVariants: 3_587_441,
			metaOR: 1.12,
			ciLower: 1.09,
			ciUpper: 1.15,
			pValue: 8.7e-13,
			i2: 12.1,
			auc: 0.635,
			effects: effects(
				[1.14, 1.07, 1.21],
				[0.98, 0.85, 1.12],
				[1.01, 0.87, 1.18],
				[1.07, 0.79, 1.44],
				[1.01, 0.85, 1.2],
				[1.01, 0.96, 1.06]
			)
		}
	]
};
