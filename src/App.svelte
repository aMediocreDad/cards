<script lang="ts">
	import { backIn, backOut } from "svelte/easing";
	import { Writable } from "svelte/store";
	import { TransitionConfig, slide } from "svelte/transition";
	import { Card } from "./types";

	export let hands: Writable<Card[]>;

	function displayCard(card: Card) {
		OrcnogFancyCardDealer({
			deckName: card.origin.name,
		}).view(card._id, false, false, false);
	}

	async function removeCard(card: Card) {
		const ok = await Dialog.wait({
			title: "Remove card",
			content: `Are you sure you want to remove ${card.name} from ${card.origin.name}?`,
			buttons: [
				{
					label: "Yes",
					value: true,
				},
				{
					label: "No",
					value: false,
				},
			],
		});
		if (ok) card.parent.pass(card.source, [card._id]);
	}

	function spin(_node: Element, options: TransitionConfig & { times?: number } = {}) {
		const { times = 1 } = options;
		return {
			...options,
			// The value of t passed to the css method
			// varies between zero and one during an "in" transition
			// and between one and zero during an "out" transition.
			css(t: number) {
				// Svelte takes care of applying the easing function.
				const degrees = 360 * times; // through which to spin
				return `transform: rotate3d(0,1,0,${t * degrees}deg);`;
			},
		};
	}

	let open = true;
</script>

<aside class="app">
	<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<h3
		role="button"
		on:click={() => {
			open = !open;
		}}
	>
		<i class="fas fa-cards" /> Cards <i class="players-mode fas fa-angle-{open ? 'up' : 'down'}" />
	</h3>
	{#if open}
		<div
			transition:slide={{
				axis: "y",
			}}
		>
			{#each $hands as card}
				<button
					in:spin={{ easing: backOut, duration: 1500 }}
					out:spin={{ easing: backIn, duration: 500 }}
					type="button"
					on:click={() => displayCard(card)}
					on:contextmenu={(e) => {
						e.preventDefault();
						removeCard(card);
					}}><img src={card.img} alt={card.name} /></button
				>
			{/each}
		</div>
	{/if}
</aside>

<style>
	.app {
		width: var(--players-width);
		margin: 0 5px 10px 15px;
		padding: 0;
		border: 1px solid var(--color-border-dark);
		pointer-events: all;
	}

	.app h3 {
		margin: 3px;
		padding: 4px;
		border-bottom: 2px groove var(--color-border-dark-secondary);
	}

	.app .players-mode {
		font-size: var(--font-size-16);
		margin: 0 5px;
		color: var(--color-text-light-primary);
	}

	.app button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		line-height: 0;
		width: 42px;
		box-shadow: 0px 0px 0px 0px transparent;
		transition: box-shadow 0.2s ease-in-out;
	}

	.app button:hover {
		cursor: pointer;
		box-shadow: 0px 0px 5px 2px var(--color-shadow-primary);
	}

	.app div {
		padding: 4px 8px 8px;
		display: flex;
		gap: 4px;
	}
</style>
