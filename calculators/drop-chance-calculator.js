
document.addEventListener("DOMContentLoaded", () => {
    // Ensure the action-count updates on page load
    evaluateActionCount();
});

/**
 * Everytime the input is updated, this function is called to update
 * the action count.
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
	
	input.value = value;
	
	evaluateActionCount();
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
	if (isNaN(n) || !isFinite(n)) {
		actionCountInput.innerText = "Invalid";
	} else {
		actionCountInput.innerText = n;
	}
}
