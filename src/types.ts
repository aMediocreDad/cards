export declare class Card {
	_id: string;
	name: string;
	img: string;
	origin: {
		name: string;
	};
	/** The Hand or Pile where the card is currently located */
	parent: Stack;
	permission: 0 | 1 | 2 | 3;
	/** The Deck where the card originated from */
	source: Stack;
}

export declare class Stack {
	_id: string;
	name: string;
	cards: Card[];
	permission: 0 | 1 | 2 | 3;
	type: "deck" | "hand" | "pile";

	pass(...args: any[]): void;
}

declare global {
	class Dialog {
		static wait(...args: any[]): Promise<any>;
	}

	class Hooks {
		static on(event: string, callback: (...args: any[]) => void): void;
	}

	class Macro {
		static create(...args: any[]): void;

		update(...args: any[]): void;
	}

	var game: {
		cards: {
			contents: Stack[];
		};
		macros: {
			getName: (name: string) => Macro;
		};
	};

	function OrcnogFancyCardDealer(...args: any[]): {
		view(...args: any[]): void;
	};
}
