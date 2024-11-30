
window.MathJax = {
	loader: { load: ["[tex]/color"] },
	tex: {
		inlineMath: [["$", "$"], "\\(", "\\)"],
	},
	svg: {
		// Optional but improves performance apparently.
		fontCache: "global"
	},
};

// Load the MathJax script.
(function () {
	var script = document.createElement("script");
	script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js";
	script.async = true;
	document.head.appendChild(script);
})();
