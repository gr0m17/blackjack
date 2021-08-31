Generate a deck of cards.

Shuffle the cards.

Cut the cards.

Set cut depth for cut card.

Burn first card.

Deal 2 cards to all players.

Check dealer card 1 for aces, if yes, offer insurance.

Check for blackjacks for all players. If yes, award win (insurance exception).

Reconcile hand(s):

// Split expansion //

Hit/double/stand for 2 cards.

If hit, if value > 21 (unless ace, then subtract 10), bust, else if 21 stand, else hit/stand.

If stand, reconcile next hand.

On dealer hand, evaluate based on selected house rules. Default rules:

If hand value < 17, hit, else stand. (ace exception)

Evaluate all hands vs dealer hand. If = push(), if > dealer, win, if < lose.

Report outcome.

If cut card has been reached: shuffle, else deal from top of stack.
