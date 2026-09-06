import type { AutocompleteItem } from './types';
import initSqlJs from 'sql.js';

type SqlIndex = { pgs: AutocompleteItem[]; phecode: AutocompleteItem[] };

let indexPromise: Promise<SqlIndex> | null = null;

async function loadIndex(): Promise<SqlIndex> {
	const [SQL, buffer] = await Promise.all([
		initSqlJs({ locateFile: (file) => `/${file}` }),
		fetch('/autocomplete.db').then((r) => r.arrayBuffer()),
	]);
	const db = new SQL.Database(new Uint8Array(buffer));

	const toItems = (sql: string): AutocompleteItem[] => {
		const result = db.exec(sql)[0];
		return (result?.values ?? []).map((row) => ({
			id: row[0] as string,
			label: (row[1] as string | null) ?? (row[0] as string),
		}));
	};

	const pgs = toItems('SELECT pgs, efo_label FROM pgs_labels ORDER BY pgs');
	const phecode = toItems('SELECT phecode, phenotype FROM phecode_defs ORDER BY phecode');
	db.close();
	return { pgs, phecode };
}

export async function getAutocompleteIndex(type: 'pgs' | 'phecode'): Promise<AutocompleteItem[]> {
	indexPromise ??= loadIndex();
	return (await indexPromise)[type];
}
