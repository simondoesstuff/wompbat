export function formatOR(or: number, ciLower: number, ciUpper: number): string {
	return `${or.toFixed(2)} [${ciLower.toFixed(2)}–${ciUpper.toFixed(2)}]`;
}

export function formatPValue(p: number): string {
	if (p === 0) return '< 1e-300';
	if (p < 0.001) return p.toExponential(1);
	return p.toFixed(3);
}

export function formatNumber(n: number): string {
	return n.toLocaleString('en-US');
}

export function formatI2(i2: number): string {
	return `${i2.toFixed(1)}%`;
}

export function formatPrevalence(p: number): string {
	return `${p.toFixed(1)}%`;
}
