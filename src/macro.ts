export function createDealMacro() {
	const macro = /* javascript */ `
	function getStackChoices(type) {
		return game.cards.contents
			.filter((card) => card.type === type)
			.map((card) => \`<option value="\${card._id}">\${card.name}</option>\`);
	};

	(async () => {
		const content = \`
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 8px; padding: 4px 4px 8px">
				<label for="deck">From
					<select id="deck">
						\${getStackChoices("deck")}
					</select>
				</label>
				<label for="hand">To
					<select id="hand">
						\${getStackChoices("hand")}
					</select>
				</label>
				<div style="display: flex; gap: 8px;">
					<label for="count">Count
						<input type="number" id="count" min="1" value="1" style="width: 40px;" />
					</label>
					<label for="shuffle" style="display: flex; align-items: center;">Shuffle
						<input type="checkbox" id="shuffle" />
					</label>
				</div>
			</div>
		\`;
		const response = await Dialog.wait({
			title: "Deal Cards",
			content,
			buttons: {
				ok: {
					label: "Ok",
					callback: (html) => {
						const deck = html.find("#deck").val();
						const hand = html.find("#hand").val();
						const count = html.find("#count").val();
						const shuffle = html.find("#shuffle").is(":checked");
						return { deck, hand, count, shuffle };
					},
				},
			},
		});

		const deck = game.cards.get(response.deck);
		const hand = game.cards.get(response.hand);
		if (response.shuffle) await deck.shuffle();
		deck.deal([hand], response.count);
	})()
	`;
	const existingMacro = game.macros.getName("Deal Cards");
	if (existingMacro) {
		existingMacro.update({ command: macro });
	} else {
		Macro.create({
			name: "Deal Cards",
			type: "script",
			img: "icons/svg/card-hand.svg",
			command: macro,
		});
	}
}
