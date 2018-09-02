import postcss from "postcss";

function getKeyword(root) {
	let keywords = [];

	root.walkAtRules("keyword", rule => {
		var array1 = rule.params.split(":");
		var keyword = {};
		keyword.name = array1[0];
		keyword.content = array1[1].trim();
		keywords.push(keyword);
	});

	return keywords;
}

export default postcss.plugin("postcss-keywords", opts => {
	console.log("opts", opts);

	return root => {
		// console.log("root, result", root, result);
		const keywords = getKeyword(root);
		for (let i = 0; i < keywords.length; i++) {
			root.walkDecls(decl => {
				if (decl.value === keywords[i].name) {
					decl.value = keywords[i].content;
				}
			});
		}
		root.walkAtRules("keyword", rule => {
			rule.remove();
		});
	};
});
