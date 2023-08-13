<script>
	import { slide } from "svelte/transition";

	const hands = game.cards.contents
		.filter((c) => {
			return c.type === "hand" && !c.limited;
		})
		.flatMap((c) => Array.from(c.cards));

	const displayCard = (card) => {
		OrcnogFancyCardDealer({
			deckName: card.origin.name,
		}).view(card._id, false, false, false);
	};

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
			{#each hands as card}
				<button type="button" on:click={() => displayCard(card)}><img src={card.img} alt={card.name} /></button>
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
	}

	.app button:hover {
		cursor: pointer;
		box-shadow: 1px 1px 4px var(--color-border-dark);
	}

	.app div {
		padding: 4px 8px 8px;
		display: flex;
		gap: 4px;
	}
</style>
