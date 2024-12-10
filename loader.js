// Helper to load a script dynamically.
function loadScript(url) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url;
		script.async = true;
		script.onload = () => {
			loadedScripts.add(url);
			resolve();
		};
		script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
		
		document.head.appendChild(script);
	});
}

// Helper to load a stylesheet dynamically.
function loadStyle(url) {
	return new Promise((resolve, reject) => {
		if (loadStyles.has(url)) {
			resolve();
			return;
		}
		
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = url;
		link.onload = () => {
			loadedScripts.add(url);
			resolve();
		};
		link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
		
		document.head.appendChild(link);
	});
}

function preloadLibraries() {
	// Setup math-jax files.
	window.MathJax = {
		loader: { load: ["[tex]/color"] },
		tex: {
			inlineMath: [["$", "$"]],
			displayMath: [["$$", "$$"]],
		},
		svg: {
			// Optional but improves performance apparently.
			fontCache: "global",
			mtextInheritColor: true,
		},
	};
}

function postloadLibraries() {
	document.querySelectorAll("pre code").forEach(block => { hljs.highlightElement(block); })
}

document.addEventListener("DOMContentLoaded", () => {
	preloadLibraries();
	
	// Load highlight.js
	Promise.all([
		// MathJax
		loadScript("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js"),
		
		// highlight.js
		loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"),
		loadStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"),
	]).then(postloadLibraries);
	
});
