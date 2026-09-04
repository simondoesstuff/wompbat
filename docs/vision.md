## Project Overview

We are building a data browser driven by a "mega-table" containing 5,747,365 rows and 137 columns. Each row represents a unique pairing between a Polygenic Risk Score (PGS) and a clinical phenotype code (phecode). The columns contain their association summary statistics and score/phenotype features.

**Primary User Goal:** Users want to search for either a specific PGS or a specific phecode to discover and evaluate its top genetic associations, summary statistics, and related data plots (such as forest plots of Odds Ratios across different ancestries).

---

## Proposed Application Layout

The core interface should be split into two main tabs based on the user's starting point: **Search by PGS** and **Search by Phecode**.

### Tab 1: PGS Searching Tab

This tab is for users who have a specific genetic score in mind and want to see which clinical phenotypes it affects most strongly.

**Search & Input Requirements**

- **Search Bar (MVP):** Text input for the user to key in a specific PGS ID.

- **Search Bar (Aspirational):** Autocomplete text input allowing users to search by a phenotype name to find and select the relevant PGS ID from our database.

- **Settings Dropdown:** A toggle or dropdown to select the "PGS unit". Options are "continuous" or "thresholded".

**Header/Info Panel**

- Displays the core phenotype the searched PGS was originally developed for.

- Displays the number of genetic variants found in the CCPM (Colorado Center for Personalized Medicine).

- Provides an external URL linking to the corresponding score page on the PGS catalog.

**Data Table View**

- Displays the top 10 phecodes most strongly associated with the searched PGS.

- **Columns needed:** Summary statistics per ancestry and meta-analysis (Odds Ratio [OR], p-value, I2, AUC) and prevalence in CCPM (per ancestry and overall).

- **Filtering (Aspirational):** A filter toggle for "low heterogeneity" (e.g., I2 < X) that refreshes the table to show the top 10 results under that constraint.

- **Cross-linking (Aspirational):** Clicking a phecode name in the table directly switches the app to the "Phecode searching tab" for that specific code.

**Data Visualizations**

- **Forest Plot (MVP):** Multi-color forest plots depicting the Odds Ratio (OR) and standard error (s.e.) of the PGS-phecode association across ancestry groups. This can either display 10 panels at once (one for each row in the table) or a single dynamic panel that updates when the user clicks a specific row in the table.

- **Bar Plot (Aspirational):** A plot showing sample size and case size across ancestry groups, which updates when clicking a specific row in the table.

---

### Tab 2: Phecode Searching Tab

This tab is for users who have a clinical condition in mind and want to see which genetic scores (PGS) are most predictive of it.

**Search & Input Requirements**

- **Search Bar (MVP):** Text input for the user to key in a >=3-digit phecode ID.

- **Search Bar (Aspirational):** Autocomplete text input allowing users to search by the name/description of the phecode rather than just the ID number.

**Header/Info Panel**

- Displays the corresponding readable phecode name (e.g., "250.1 == Type 1 diabetes").

- Displays the parental domain/category of the condition.

- Displays the sample size and case size across groups within the CCPM.

**Data Table View**

- Displays the top 10 PGSs most strongly associated with the searched phecode.

- **Columns needed:** Summary statistics per ancestry and meta-analysis (OR, p-value, I2, AUC) and PGS features (number of variants used in CCPM).

- **Filtering (Aspirational):** A filter toggle for "low heterogeneity" (e.g., I2 < X) that refreshes the table to show the top 10 results under that constraint.

- **Cross-linking (Aspirational):** Clicking a PGS ID in the table directly switches the app to the "PGS searching tab" for that specific score.

**Data Visualizations**

- **Forest Plot (MVP):** Multi-color forest plots depicting the OR and s.e. of the PGS-phecode association across ancestry groups. Like the other tab, this can show 10 panels at once or one dynamic panel based on the selected table row.
