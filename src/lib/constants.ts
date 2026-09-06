import type { Ancestry } from "./types";

export const ANCESTRIES: Ancestry[] = [
  "EUR",
  "AMR",
  "AFR",
  "EAS",
  "CSA",
  "MLE",
  "Meta",
];

// Okabe-Ito palette, mapped to ancestry groups
export const ANCESTRY_COLORS: Record<Ancestry, string> = {
  EUR: "#0072B2",
  AMR: "#D55E00",
  AFR: "#E69F00",
  EAS: "#009E73",
  CSA: "#56B4E9",
  MLE: "#CC79A7",
  Meta: "#222222",
};

export const ANCESTRY_COLOR_DOMAIN = ANCESTRIES;
export const ANCESTRY_COLOR_RANGE = ANCESTRIES.map((a) => ANCESTRY_COLORS[a]);

// Band-scale y-domains for svelteplot (bottom→top order so EUR renders at visual top)
export const FOREST_BAND_DOMAIN: Ancestry[] = [
  "Meta",
  "MLE",
  "CSA",
  "EAS",
  "AFR",
  "AMR",
  "EUR",
];
export const COHORT_BAND_DOMAIN: Ancestry[] = [
  "MLE",
  "CSA",
  "EAS",
  "AFR",
  "AMR",
  "EUR",
];

// TSV export column headers
export const PGS_EXPORT_HEADERS = [
  "PGS ID",
  "EFO Label",
  "CCPM Variants",
  "Meta OR",
  "CI Lower",
  "CI Upper",
  "P-Value",
  "I2",
  "AUC",
] as const;
export const PHECODE_EXPORT_HEADERS = [
  "Phecode",
  "Phenotype Name",
  "Meta OR",
  "CI Lower",
  "CI Upper",
  "P-Value",
  "I2",
  "AUC",
  "Prevalence",
] as const;

export const TOTAL_ASSOCIATIONS = 5_747_365;
export const GENOME_BUILD = "GRCh38";
export const ENSEMBL_VERSION = "Ensembl v106";
