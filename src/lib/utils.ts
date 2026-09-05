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

// Beasley-Springer-Moro approximation of the inverse normal CDF (max error ~4.5e-4)
function qnorm(p: number): number {
	const q = p < 0.5 ? p : 1 - p;
	const t = Math.sqrt(-2 * Math.log(Math.max(q, 1e-15)));
	const num = 2.515517 + t * (0.802853 + t * 0.010328);
	const den = 1 + t * (1.432788 + t * (0.189269 + t * 0.001308));
	return (p < 0.5 ? -1 : 1) * (t - num / den);
}

// Derive 95% CI from odds ratio and two-tailed p-value.
// SE = |log(OR)| / z, where z = Φ⁻¹(1 - p/2)
export function deriveCI(or: number, pval: number): { ciLower: number; ciUpper: number } {
	const logOR = Math.log(or);
	const z = qnorm(1 - Math.min(pval, 0.9999) / 2);
	const se = z > 0 ? Math.abs(logOR) / z : 0;
	return {
		ciLower: Math.exp(logOR - 1.96 * se),
		ciUpper: Math.exp(logOR + 1.96 * se)
	};
}
