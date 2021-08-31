'use strict';

// Build lookup Table for Cards
const cardWidth = 50;
const cardHeight = 80;
const dealerHand = [];
const playerHand = [];
const discard = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = [
  null,
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
];
const cards = [];
let cardCount = 0;
let cardhtml;
let aceCount;
let downCard;
let playerScore = 0;
let needShuffle = false;
// Card Generator
const makeCard = function (suit, rank) {
  // yposition = 0 for 0, -80 for 1, -160 for 2, -240 for 3
  let yPosition = suit * cardHeight * -1;
  let xPosition;
  if (rank === 1) {
    xPosition = cardWidth;
  } else {
    xPosition = cardWidth * 15 - cardWidth * rank;
  }
  //if rank = 1 x = 50, otherwise 2 = 650, 3 = 600, ... king = 100;
  //yposition = suit * height
  let card = { suit, rank, xPosition, yPosition };
  return card;
};
//Write the name of the selected card:
const cardName = function (card) {
  return `The ${ranks[card.rank]} of ${suits[card.suit]}`;
};

// Build a Deck
const buildDeck = function () {
  let cardIndex = 0;
  for (let suit = 0; suit <= 3; suit++) {
    for (let rank = 1; rank <= 13; rank++) {
      cards[cardIndex] = makeCard(suit, rank);
      cardIndex++;
    }
  }
};

//sweet shuffling implemetation:
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  const cutCard = { rank: null };
  array.splice(30, 0, cutCard);
}

//evaluate player hand value
const evaluateHand = function (handArray) {
  let handValue = 0;
  let aceCount = 0;
  for (let i = 0; i < handArray.length; i++) {
    if (handArray[i].rank == 1) {
      handValue += 11;
      aceCount++;
    } else if (handArray[i].rank >= 10) {
      handValue += 10;
    } else {
      handValue += handArray[i].rank;
    }
  }
  if (handValue > 21) {
    if (aceCount > 0) {
      handValue -= 10;
      aceCount--;
    }
  }
  return handValue;
};

const dealerTurn = function () {
  let dealerScore = evaluateHand(dealerHand);
  if (dealerScore <= 16) {
    hitDealer();
    dealerTurn();
  } else if (dealerScore == 17) {
    // aceCount = 0;
    // for (let i = 0; i < dealerHand.length; i++) {
    //   if (dealerHand[i].rank == 1) {
    //     aceCount++;
    //     hitDealer();
    //     dealerTurn();
    //   }
    // }
    // finalScore();

    let handValue = 0;
    let aceCount = 0;
    for (let i = 0; i < dealerHand.length; i++) {
      if (dealerHand[i].rank == 1) {
        handValue += 11;
        aceCount++;
      } else if (dealerHand[i].rank >= 10) {
        handValue += 10;
      } else {
        handValue += dealerHand[i].rank;
      }
    }
    for (let i = aceCount; i > 0; i--) {
      if (handValue > 21) {
        if (aceCount > 0) {
          handValue -= 10;
          aceCount--;
        }
      }
    }

    if (aceCount === 0) {
      finalScore();
    } else {
      hitDealer();
      dealerTurn();
    }
  } else {
    finalScore();
  }
};
const finalScore = function () {
  let finalDealer = evaluateHand(dealerHand);
  let finalPlayer = evaluateHand(playerHand);
  //push conditions
  if (finalPlayer > 21) {
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} You busted! Dealer wins!`;
    playerScore--;
  } else if (finalDealer > 21) {
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} Dealer busts! You Win!`;
    playerScore++;
  } else if (finalDealer == finalPlayer) {
    //push next to both scores
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} You Pushed!`;
    console.log('push');
  } else if (finalDealer > finalPlayer) {
    //dealer wins
    console.log('dealer wins!');
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} Dealer wins!`;
    playerScore--;
  } else {
    console.log('player wins!');
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} You win!`;
    playerScore++;
  }
  document.querySelector('#newGame').removeAttribute('disabled');
  document.querySelector('#wins').innerHTML = `wins: ${playerScore}`;
  console.log(playerScore);
};

const dealCard = function () {
  const newCard = cards.shift();
  if (newCard.rank === null) {
    needShuffle = true;
    console.log('need shuffle!');
    return cards.shift();
  }
  return newCard;
};

const hitDealer = function () {
  dealerHand[dealerHand.length] = dealCard();
  let cardhtml = `<div class="playingCard" id="card---${cardCount}" style="height: ${cardHeight}px; width: ${cardWidth}px; background-position: ${
    dealerHand[dealerHand.length - 1].xPosition
  }px ${
    dealerHand[0].yPosition
  }px;  animation-name: cardToss; animation-duration: 1.2s;"></div>`;
  document
    .querySelector('#dealerHand')
    .insertAdjacentHTML('beforeend', cardhtml);
  cardCount++;
  document.querySelector('#dealerHandValue').textContent =
    evaluateHand(dealerHand);
};
const checkBlackjack = function () {
  if (evaluateHand(dealerHand) == 21) {
    stayHand();
  }
};
const hitDealerFaceDown = function () {
  dealerHand[1] = dealCard();
  downCard = cardCount;
  cardhtml = `<div class="playingCard" id="card---${cardCount}" style="height: ${cardHeight}px; width: ${cardWidth}px;  animation-name: cardToss; animation-duration: 1.5s;"></div>`;
  document
    .querySelector('#dealerHand')
    .insertAdjacentHTML('beforeend', cardhtml);
  cardCount++;
  // checkBlackjack();
};

const hitPlayer = function () {
  playerHand[playerHand.length] = dealCard();
  cardhtml = `<div class="playingCard" id="card---${cardCount}}" style="height: ${cardHeight}px; width: ${cardWidth}px;
  background-position: ${playerHand[playerHand.length - 1].xPosition}px
  ${
    playerHand[playerHand.length - 1].yPosition
  }px;  animation-name: cardToss; animation-duration: 1s;"></div>`;
  document
    .querySelector('#playerHand')
    .insertAdjacentHTML('beforeend', cardhtml);
  cardCount++;

  //update hand value on the screen
  //if hand value == 21, automatically stay.
  document.querySelector('#playerHandValue').textContent =
    evaluateHand(playerHand);
  if (evaluateHand(playerHand) >= 21) {
    stayHand(playerHand);
  }
};
const flipDown = function () {};
const stayHand = function () {
  document
    .querySelector(`#card---${downCard}`)

    .setAttribute(
      'style',
      `height: ${cardHeight}px; width: ${cardWidth}px; background-position: ${dealerHand[1].xPosition}px ${dealerHand[1].yPosition}px`
    );
  document.querySelector('#dealerHandValue').textContent =
    evaluateHand(dealerHand);
  //disable the hit button
  document
    .querySelector('#hit')

    .setAttribute('disabled', 'disabled');
  //disable the stay button
  document
    .querySelector('#stay')

    .setAttribute('disabled', 'disabled');
  if (evaluateHand(playerHand) > 21) {
    document.querySelector('#playerHandValue').textContent = `${evaluateHand(
      playerHand
    )} BUST`;
    finalScore();
  } else {
    dealerTurn();
  }
};

//collect all the cards in play into the discard:
const discardHands = function () {
  discard.push(...playerHand);
  discard.push(...dealerHand);
  console.log(discard);
  playerHand.length = 0;
  dealerHand.length = 0;
  document.querySelector('#playerHand').innerHTML = '';
  document.querySelector('#dealerHand').innerHTML = '';
};

const newGame = function () {
  discardHands();
  if (needShuffle === true) {
    console.log('need shuffle, do shuffle');
    cards.push(...discard);
    discard.length = 0;
    shuffleArray(cards);
  }
  document
    .querySelector('#newGame')

    .setAttribute('disabled', 'disabled');
  document.querySelector('#hit').removeAttribute('disabled');
  document.querySelector('#stay').removeAttribute('disabled');

  //deal the cards:
  //one card into the dealerHand, then one card into the playerHand. Do this twice.
  //first dealer card face up.
  hitDealer();
  // dealerHand[0] = cards.shift();
  // let cardhtml = `<div class="playingCard" id="card---${cardCount}" style="height: ${cardHeight}px; width: ${cardWidth}px; background-position: ${dealerHand[0].xPosition}px ${dealerHand[0].yPosition}px"></div>`;
  // document.querySelector('#dealerHand').insertAdjacentHTML('beforeend', cardhtml);
  // cardCount++;

  //hitting is the same as dealing.
  hitPlayer();

  //dealer card 2 face down.
  hitDealerFaceDown();
  //hitting is the same as dealing.
  hitPlayer();
  //make an array of card elements currently in the document.

  //evaluate the hands.
};

//initialization
buildDeck();
shuffleArray(cards);
newGame();
// //insert a cut card to trigger shuffle
// function insertAt(array, index, ...elementsArray) {
//   array.splice(index, 0, ...elements);
// }
// insertAt(cards, 32, {cutcard})

//print card stack to console [for dev]
for (let i = 0; i < cards.length; i++) {
  console.log(cardName(cards[i]));
}
console.log(cards);
