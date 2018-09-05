import postcss from "postcss";

function getKeyword(root) {
	let keywords = [];

	// Look for every keyword definition
	root.walkAtRules("keyword", rule => {
		// Create object so can look for keywords in CSS
		let keyword = {};
		keyword.name = rule.params;
		keyword.props = [];

		rule.each(decl => {

			// Grab value
		  if (decl.prop === "value") {
				keyword.value = decl.value;
			}

			// Grab array of properties
			if (decl.prop === "property") {
				let array = decl.value.split(",");
				for (let i = 0; i < array.length; i++) {
					keyword.props.push(array[i].trim())
				}

			}
		});

		// Create regex to allow matching of properties
		keyword.propsRegex = new RegExp(keyword.props.join("|"), 'i');
		// Create regex to replace instances of word in declaration value
		keyword.nameRegex = new RegExp("\\b" + keyword.name + "\\b", 'gi');

		keywords.push(keyword);
	});
	return keywords;
}

export default postcss.plugin("postcss-keywords", opts => {
	console.log("opts", opts);

	return root => {
		// console.log("root, result", root, result);
		const keywords = getKeyword(root);

		// For each keyword definition
		for (let i = 0; i < keywords.length; i++) {
			root.walkDecls(keywords[i].propsRegex, decl => {
				// Replace instances of keyword name with correct value
				decl.value = decl.value.replace(keywords[i].nameRegex, keywords[i].value);
			});
		}
		root.walkAtRules("keyword", rule => {
			rule.remove();
		});
	};
});
