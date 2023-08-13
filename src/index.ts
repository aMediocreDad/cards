import App from "./App.svelte";

declare global {
	class Hooks {
		static on(event: string, callback: () => void): void;
	}
}

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

Hooks.on("ready", () => {
	const parent = maybe(document.querySelector("#ui-left")).expect("No chat log found");
	const app = new App({
		target: parent,
		anchor: parent.lastElementChild!,
		intro: true,
	});
});
