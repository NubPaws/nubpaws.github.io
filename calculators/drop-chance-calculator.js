
document.addEventListener("DOMContentLoaded", () => {
    // Ensure the action-count updates on page load
    evaluateActionCount();
});

/**
 * Everytime any one of the inputs is updated, this function is called to update
 * the rest.
 * 
 * @param {HTMLInputElement} input 
 * @param {string} displayId 
 */
function updateValue(input) {
	if (!input.value) {
		input.value = "0";
	}
	
	let value = parseFloat(input.value);
	
	const min = parseFloat(input.min);
	const max = parseFloat(input.max);
	
	if (value < min) value = min;
	if (value > max) value = max;
	
	const isActionCount = input.id === "action-count";
	
	if (isActionCount)
		input.value = Math.round(value);
	else input.value = value;
	
	if (isActionCount)
		evaluateSuccessRate();
	else evaluateActionCount();
}

function evaluateSuccessRate() {
	const dropChance = parseFloat(document.getElementById("drop-chance").value);
	const actionCount = parseInt(document.getElementById("action-count").value);
	const successRateInput = document.getElementById("success-rate");
	
	const p = dropChance / 100;
	const n = actionCount;
	
	const c = 1 - Math.pow(1 - p, n);
	if (isNaN(c) || !isFinite(c))
		successRateInput.value = "Invalid";
	else successRateInput.value = (c * 100).toPrecision(5);
}

function evaluateActionCount() {
	const dropChance = parseFloat(document.getElementById("drop-chance").value);
	const successRate = parseFloat(document.getElementById("success-rate").value);
	const actionCountInput = document.getElementById("action-count");
	
	// Convert to probabilities.
	const p = dropChance / 100;
	const c = successRate / 100;
	
	// Calculate action count using the formula.
	const n = Math.ceil(Math.log(1 - c) / Math.log(1 - p));
	if (isNaN(n) || !isFinite(n))
		actionCountInput.value = "Invalid";
	else actionCountInput.value = n;
}

/**
 * Evaludate gcd(a, b) using Euclead's algorithm.
 * 
 * @param {number} a 
 * @param {number} b 
 */
function gcd(a, b) {
	while (b !== 0) {
		let tmp = b;
		b = a % b;
		a = tmp;
	}
	return a;
}

/**
 * Evaluate nCr(n, r) using the gcd function.
 * 
 * @param {number} n 
 * @param {number} r 
 */
function nCr(n, r) {
	if (r > n) return 0;
	if (r === 0 || r === n) return 1;
	
	// Take the minimum as nCr is symmetric.
	r = Math.min(r, n - r);
	
	let numerator = 1;
	let denominator = 1;
	
	for (let i = 1; i <= r; i++) {
		numerator *= n--;
		denominator *= i;
		
		// Simplifications of numerator and denomerator to prevent
		// them from growing too quickly.
		const divisor = gcd(numerator, denominator);
		numerator /= divisor;
		denominator /= divisor;
	}
	
	// The denominator should be 1 by this point.
	return numerator;
}
