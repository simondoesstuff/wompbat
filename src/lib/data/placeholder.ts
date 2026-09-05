import type {
	AncestryEffect,
	AncestryStats,
	AutocompleteItem,
	PgsSearchResult,
	PhecodeSearchResult
} from '../types';
import { deriveCI } from '../utils';

// Build AncestryEffect from OR + pval (CI derived). Pass null to omit a group.
function effect(
	ancestry: AncestryEffect['ancestry'],
	or: number,
	pval: number
): AncestryEffect {
	const { ciLower, ciUpper } = deriveCI(or, pval);
	return { ancestry, or, ci_lower: ciLower, ci_upper: ciUpper };
}

function stats(
	eurC: number, eurS: number,
	amrC: number, amrS: number,
	afrC: number, afrS: number,
	easC: number, easS: number,
	csaC: number, csaS: number,
	mleC: number, mleS: number
): AncestryStats[] {
	return [
		{ ancestry: 'EUR', cases: eurC, sample: eurS },
		{ ancestry: 'AMR', cases: amrC, sample: amrS },
		{ ancestry: 'AFR', cases: afrC, sample: afrS },
		{ ancestry: 'EAS', cases: easC, sample: easS },
		{ ancestry: 'CSA', cases: csaC, sample: csaS },
		{ ancestry: 'MLE', cases: mleC, sample: mleS }
	];
}

export const pgsPlaceholder: PgsSearchResult = {
	info: {
		pgsId: 'PGS000018',
		corePhenotype: 'Coronary artery disease / myocardial infarction',
		ccpmVariants: 6_432_190,
		catalogUrl: 'https://www.pgscatalog.org/score/PGS000018/'
	},
	rows: [
		{
			phecodeId: '411.4',
			phenotypeName: 'Coronary atherosclerosis',
			metaOR: 1.44,
			ciLower: deriveCI(1.44, 2.2e-184).ciLower,
			ciUpper: deriveCI(1.44, 2.2e-184).ciUpper,
			pValue: 2.2e-184,
			i2: 18.2,
			auc: 0.741,
			prevalence: 18.8,
			effects: [
				effect('EUR', 1.46, 1.2e-50),
				effect('AMR', 1.26, 2.1e-8),
				effect('AFR', 1.31, 8.4e-7),
				effect('EAS', 1.39, 2.3e-4),
				effect('CSA', 1.31, 1.1e-5),
				effect('Meta', 1.44, 2.2e-184)
			],
			ancestryStats: stats(9208, 48702, 2672, 34208, 1634, 8698, 622, 7912, 639, 3488, 280, 2100)
		},
		{
			phecodeId: '411.2',
			phenotypeName: 'Myocardial infarction',
			metaOR: 1.4,
			ciLower: deriveCI(1.4, 8.4e-122).ciLower,
			ciUpper: deriveCI(1.4, 8.4e-122).ciUpper,
			pValue: 8.4e-122,
			i2: 36.9,
			auc: 0.724,
			prevalence: 9.2,
			effects: [
				effect('EUR', 1.42, 3.1e-40),
				effect('AMR', 1.22, 7.2e-6),
				effect('AFR', 1.27, 4.1e-5),
				effect('EAS', 1.35, 0.018),
				effect('CSA', 1.28, 8.9e-5),
				effect('Meta', 1.4, 8.4e-122)
			],
			ancestryStats: stats(4482, 48702, 1288, 34208, 788, 8698, 287, 7912, 311, 3488, 136, 2100)
		},
		{
			phecodeId: '413.3',
			phenotypeName: 'Angina pectoris',
			metaOR: 1.34,
			ciLower: deriveCI(1.34, 5.1e-44).ciLower,
			ciUpper: deriveCI(1.34, 5.1e-44).ciUpper,
			pValue: 5.1e-44,
			i2: 12.8,
			auc: 0.685,
			prevalence: 6.5,
			effects: [
				effect('EUR', 1.36, 2.2e-22),
				effect('AMR', 1.18, 0.0041),
				effect('AFR', 1.22, 0.0089),
				effect('EAS', 1.28, 0.042),
				effect('CSA', 1.22, 0.0097),
				effect('Meta', 1.34, 5.1e-44)
			],
			ancestryStats: stats(3172, 48702, 912, 34208, 556, 8698, 198, 7912, 218, 3488, 95, 2100)
		},
		{
			phecodeId: '411.1',
			phenotypeName: 'Unstable angina',
			metaOR: 1.34,
			ciLower: deriveCI(1.34, 1.0e-64).ciLower,
			ciUpper: deriveCI(1.34, 1.0e-64).ciUpper,
			pValue: 1.0e-64,
			i2: 12.0,
			auc: 0.685,
			prevalence: 6.5,
			effects: [
				effect('EUR', 1.35, 4.4e-28),
				effect('AMR', 1.17, 0.0059),
				effect('AFR', 1.21, 0.011),
				effect('EAS', 1.27, 0.049),
				effect('CSA', 1.21, 0.012),
				effect('Meta', 1.34, 1.0e-64)
			],
			ancestryStats: stats(3172, 48702, 912, 34208, 556, 8698, 198, 7912, 218, 3488, 95, 2100)
		},
		{
			phecodeId: '411.8',
			phenotypeName: 'Other acute ischemic heart disease',
			metaOR: 1.32,
			ciLower: deriveCI(1.32, 2.4e-51).ciLower,
			ciUpper: deriveCI(1.32, 2.4e-51).ciUpper,
			pValue: 2.4e-51,
			i2: 8.6,
			auc: 0.672,
			prevalence: 5.1,
			effects: [
				effect('EUR', 1.34, 8.1e-22),
				effect('AMR', 1.15, 0.048),
				effect('AFR', 1.19, 0.028),
				effect('EAS', 1.25, 0.083),
				effect('CSA', 1.19, 0.030),
				effect('Meta', 1.32, 2.4e-51)
			],
			ancestryStats: stats(2494, 48702, 714, 34208, 436, 8698, 155, 7912, 171, 3488, 75, 2100)
		},
		{
			phecodeId: '412.8',
			phenotypeName: 'Old myocardial infarction',
			metaOR: 1.38,
			ciLower: deriveCI(1.38, 6.7e-69).ciLower,
			ciUpper: deriveCI(1.38, 6.7e-69).ciUpper,
			pValue: 6.7e-69,
			i2: 44.2,
			auc: 0.699,
			prevalence: 4.8,
			effects: [
				effect('EUR', 1.41, 2.3e-33),
				effect('AMR', 1.21, 0.0058),
				effect('AFR', 1.25, 0.0062),
				effect('EAS', 1.32, 0.046),
				effect('CSA', 1.25, 0.0076),
				effect('Meta', 1.38, 6.7e-69)
			],
			ancestryStats: stats(2342, 48702, 670, 34208, 409, 8698, 145, 7912, 160, 3488, 70, 2100)
		},
		{
			phecodeId: '414.8',
			phenotypeName: 'Chronic ischemic heart disease',
			metaOR: 1.33,
			ciLower: deriveCI(1.33, 8.0e-88).ciLower,
			ciUpper: deriveCI(1.33, 8.0e-88).ciUpper,
			pValue: 8.0e-88,
			i2: 12.3,
			auc: 0.669,
			prevalence: 8.8,
			effects: [
				effect('EUR', 1.35, 1.4e-37),
				effect('AMR', 1.15, 0.031),
				effect('AFR', 1.19, 0.020),
				effect('EAS', 1.26, 0.058),
				effect('CSA', 1.19, 0.022),
				effect('Meta', 1.33, 8.0e-88)
			],
			ancestryStats: stats(4298, 48702, 1231, 34208, 751, 8698, 267, 7912, 293, 3488, 128, 2100)
		},
		{
			phecodeId: '413.8',
			phenotypeName: 'Ischemic heart disease, unspecified',
			metaOR: 1.27,
			ciLower: deriveCI(1.27, 1.5e-38).ciLower,
			ciUpper: deriveCI(1.27, 1.5e-38).ciUpper,
			pValue: 1.5e-38,
			i2: 15.6,
			auc: 0.655,
			prevalence: 14.1,
			effects: [
				effect('EUR', 1.29, 3.2e-18),
				effect('AMR', 1.10, 0.12),
				effect('AFR', 1.14, 0.063),
				effect('EAS', 1.20, 0.13),
				effect('CSA', 1.14, 0.070),
				effect('Meta', 1.27, 1.5e-38)
			],
			ancestryStats: stats(6891, 48702, 1977, 34208, 1206, 8698, 429, 7912, 472, 3488, 206, 2100)
		},
		{
			phecodeId: '428.1',
			phenotypeName: 'Congestive heart failure',
			metaOR: 1.25,
			ciLower: deriveCI(1.25, 8.2e-25).ciLower,
			ciUpper: deriveCI(1.25, 8.2e-25).ciUpper,
			pValue: 8.2e-25,
			i2: 11.4,
			auc: 0.612,
			prevalence: 10.8,
			effects: [
				effect('EUR', 1.27, 4.2e-12),
				effect('AMR', 1.08, 0.22),
				effect('AFR', 1.12, 0.10),
				effect('EAS', 1.18, 0.21),
				effect('CSA', 1.12, 0.11),
				effect('Meta', 1.25, 8.2e-25)
			],
			ancestryStats: stats(5278, 48702, 1511, 34208, 922, 8698, 328, 7912, 361, 3488, 158, 2100)
		},
		{
			phecodeId: '415.1',
			phenotypeName: 'Peripheral vascular disease',
			metaOR: 1.16,
			ciLower: deriveCI(1.16, 4.7e-19).ciLower,
			ciUpper: deriveCI(1.16, 4.7e-19).ciUpper,
			pValue: 4.7e-19,
			i2: 21.0,
			auc: 0.598,
			prevalence: 7.1,
			effects: [
				effect('EUR', 1.18, 6.2e-8),
				effect('AMR', 1.00, 0.96),
				effect('AFR', 1.04, 0.55),
				effect('EAS', 1.09, 0.45),
				effect('CSA', 1.04, 0.52),
				effect('Meta', 1.16, 4.7e-19)
			],
			ancestryStats: stats(3473, 48702, 995, 34208, 607, 8698, 216, 7912, 238, 3488, 104, 2100)
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
		domain: 'Endocrine/metabolic',
		totalCases: 6283,
		totalSample: 64808
	},
	ancestryStats: [
		{ ancestry: 'EUR', cases: 3092, sample: 46158 },
		{ ancestry: 'AMR', cases: 1725, sample: 9920 },
		{ ancestry: 'AFR', cases: 916, sample: 5055 },
		{ ancestry: 'EAS', cases: 375, sample: 2335 },
		{ ancestry: 'CSA', cases: 175, sample: 1340 },
		{ ancestry: 'MLE', cases: 98, sample: 620 }
	],
	rows: [
		{
			pgsId: 'PGS000054',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 6_521_119,
			metaOR: 1.38,
			ciLower: deriveCI(1.38, 1.2e-88).ciLower,
			ciUpper: deriveCI(1.38, 1.2e-88).ciUpper,
			pValue: 1.2e-88,
			i2: 28.6,
			auc: 0.724,
			effects: [
				effect('EUR', 1.41, 8.1e-52),
				effect('AMR', 1.22, 4.2e-6),
				effect('AFR', 1.26, 1.1e-4),
				effect('EAS', 1.33, 0.022),
				effect('CSA', 1.26, 7.2e-4),
				effect('Meta', 1.38, 1.2e-88)
			]
		},
		{
			pgsId: 'PGS000036',
			efoLabel: 'coronary artery disease',
			ccpmVariants: 6_990_025,
			metaOR: 1.34,
			ciLower: deriveCI(1.34, 4.8e-74).ciLower,
			ciUpper: deriveCI(1.34, 4.8e-74).ciUpper,
			pValue: 4.8e-74,
			i2: 32.3,
			auc: 0.718,
			effects: [
				effect('EUR', 1.37, 2.2e-38),
				effect('AMR', 1.18, 3.2e-5),
				effect('AFR', 1.22, 6.1e-4),
				effect('EAS', 1.29, 0.040),
				effect('CSA', 1.22, 0.0012),
				effect('Meta', 1.34, 4.8e-74)
			]
		},
		{
			pgsId: 'PGS000854',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 1_428_115,
			metaOR: 1.31,
			ciLower: deriveCI(1.31, 5.6e-69).ciLower,
			ciUpper: deriveCI(1.31, 5.6e-69).ciUpper,
			pValue: 5.6e-69,
			i2: 35.1,
			auc: 0.713,
			effects: [
				effect('EUR', 1.41, 6.2e-48),
				effect('AMR', 1.22, 3.7e-6),
				effect('AFR', 1.25, 2.1e-4),
				effect('EAS', 1.29, 0.050),
				effect('CSA', 1.25, 5.8e-4),
				effect('Meta', 1.31, 5.6e-69)
			]
		},
		{
			pgsId: 'PGS001002',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 9_114_883,
			metaOR: 1.29,
			ciLower: deriveCI(1.29, 7.4e-45).ciLower,
			ciUpper: deriveCI(1.29, 7.4e-45).ciUpper,
			pValue: 7.4e-45,
			i2: 21.8,
			auc: 0.698,
			effects: [
				effect('EUR', 1.31, 4.1e-27),
				effect('AMR', 1.13, 0.049),
				effect('AFR', 1.17, 0.012),
				effect('EAS', 1.23, 0.12),
				effect('CSA', 1.17, 0.020),
				effect('Meta', 1.29, 7.4e-45)
			]
		},
		{
			pgsId: 'PGS000129',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 2_881_040,
			metaOR: 1.26,
			ciLower: deriveCI(1.26, 3.2e-38).ciLower,
			ciUpper: deriveCI(1.26, 3.2e-38).ciUpper,
			pValue: 3.2e-38,
			i2: 38.5,
			auc: 0.689,
			effects: [
				effect('EUR', 1.28, 2.1e-21),
				effect('AMR', 1.10, 0.088),
				effect('AFR', 1.14, 0.033),
				effect('EAS', 1.20, 0.16),
				effect('CSA', 1.14, 0.040),
				effect('Meta', 1.26, 3.2e-38)
			]
		},
		{
			pgsId: 'PGS000711',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 3_902_504,
			metaOR: 1.23,
			ciLower: deriveCI(1.23, 5.1e-30).ciLower,
			ciUpper: deriveCI(1.23, 5.1e-30).ciUpper,
			pValue: 5.1e-30,
			i2: 44.2,
			auc: 0.675,
			effects: [
				effect('EUR', 1.25, 7.8e-17),
				effect('AMR', 1.08, 0.18),
				effect('AFR', 1.12, 0.064),
				effect('EAS', 1.17, 0.25),
				effect('CSA', 1.12, 0.074),
				effect('Meta', 1.23, 5.1e-30)
			]
		},
		{
			pgsId: 'PGS001285',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 6_783_280,
			metaOR: 1.22,
			ciLower: deriveCI(1.22, 8.8e-28).ciLower,
			ciUpper: deriveCI(1.22, 8.8e-28).ciUpper,
			pValue: 8.8e-28,
			i2: 19.8,
			auc: 0.675,
			effects: [
				effect('EUR', 1.24, 6.1e-16),
				effect('AMR', 1.07, 0.22),
				effect('AFR', 1.10, 0.10),
				effect('EAS', 1.16, 0.29),
				effect('CSA', 1.10, 0.11),
				effect('Meta', 1.22, 8.8e-28)
			]
		},
		{
			pgsId: 'PGS000492',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 1_126_482,
			metaOR: 1.20,
			ciLower: deriveCI(1.20, 3.4e-24).ciLower,
			ciUpper: deriveCI(1.20, 3.4e-24).ciUpper,
			pValue: 3.4e-24,
			i2: 36.0,
			auc: 0.669,
			effects: [
				effect('EUR', 1.22, 3.2e-13),
				effect('AMR', 1.05, 0.42),
				effect('AFR', 1.08, 0.22),
				effect('EAS', 1.14, 0.37),
				effect('CSA', 1.08, 0.23),
				effect('Meta', 1.20, 3.4e-24)
			]
		},
		{
			pgsId: 'PGS001558',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 5_224_998,
			metaOR: 1.16,
			ciLower: deriveCI(1.16, 1.5e-18).ciLower,
			ciUpper: deriveCI(1.16, 1.5e-18).ciUpper,
			pValue: 1.5e-18,
			i2: 29.7,
			auc: 0.651,
			effects: [
				effect('EUR', 1.18, 4.1e-10),
				effect('AMR', 1.01, 0.88),
				effect('AFR', 1.05, 0.54),
				effect('EAS', 1.10, 0.52),
				effect('CSA', 1.05, 0.51),
				effect('Meta', 1.16, 1.5e-18)
			]
		},
		{
			pgsId: 'PGS000398',
			efoLabel: 'type 2 diabetes mellitus',
			ccpmVariants: 4_102_337,
			metaOR: 1.14,
			ciLower: deriveCI(1.14, 2.2e-15).ciLower,
			ciUpper: deriveCI(1.14, 2.2e-15).ciUpper,
			pValue: 2.2e-15,
			i2: 18.4,
			auc: 0.642,
			effects: [
				effect('EUR', 1.16, 9.3e-9),
				effect('AMR', 1.00, 0.98),
				effect('AFR', 1.03, 0.68),
				effect('EAS', 1.08, 0.60),
				effect('CSA', 1.03, 0.66),
				effect('Meta', 1.14, 2.2e-15)
			]
		}
	]
};
