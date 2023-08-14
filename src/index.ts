import { writable } from "svelte/store";
import App from "./App.svelte";
import { createDealMacro } from "./macro";
import { Card, Stack } from "./types";

const cards = writable<Card[]>([]);

function maybe<T>(value: T) {
	return {
		expect: (message: string) => {
			if (value || value === false || value === 0) return value as NonNullable<T>;
			throw new Error(message);
		},
		default: <E>(defaultValue: E) => {
			return value || defaultValue;
		},
	};
}

function setCards() {
	const hands = game.cards.contents
		.filter((c) => {
			return c.type === "hand" && c.permission > 1;
		})
		.flatMap((c) => Array.from(c.cards));
	cards.set(hands);
}

Hooks.on("ready", () => {
	const parent = maybe(document.querySelector("#ui-left")).expect("No chat log found");
	new App({
		target: parent,
		anchor: parent.lastElementChild!,
		intro: true,
		props: {
			hands: cards,
		},
	});
	setCards();
	createDealMacro();
});

const cardHooks = ["createCard", "updateCard", "deleteCard"] as const;
const stackHooks = ["createCards", "updateCards", "deleteCards"] as const;

cardHooks.forEach((hook) => {
	Hooks.on(hook, (card: Card) => {
		const { parent, permission } = card;
		if (permission > 1 && parent.type === "hand") setCards();
	});
});

stackHooks.forEach((hook) => {
	Hooks.on(hook, (stack: Stack) => {
		const { type } = stack;
		if (type === "hand") setCards();
	});
});
