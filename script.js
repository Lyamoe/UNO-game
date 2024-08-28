//* ========== GET OTHER SCRIPT ==========
import visualModule from "./visualScript.js";

//* ========== CREATE MAIN VARIABLES ==========

//? Setups
let CENTER_CARD;
const DECK = [];
const PLAYER_CARDS_ARRAY = [];
const BOT1_CARDS_ARRAY = [];
const COLORS_ARRAY = ["red", "yellow", "green", "blue", "black"];
const SPECIALS_ARRAY = ["none", "sum", "block", "turn", "changeColors"];
const QUANTITY_OF_CARDS_PER_NUMBER = 4;
const INITIAL_CARDS_ON_HANDS = 7;
const INITIAL_NUMBER_CARDS = 40;
const INITIAL_COLORED_SPECIAL_CARDS = 8;
const INITIAL_BLACK_SPECIAL_CARDS = 2;
const NO_NUMBER_CARD_IDENTIFICATION = 10;
const OWNER_INDEX = {
    "player": 0,
    "deck": 1,
    "center": 2,
    "bot1": 3,
    "bot2": 4,
    "bot3": 5,
}
const WHO_PLAYS_NEXT = ["player", "bot1"];

//? Classes
class Card {
    constructor(number, color, owner, special) {
        this.number = number;
        this.color = color;
        this.owner = owner;
        this.special = special;
    }
    // get area() {
    //     return this.calculaArea();
    // }
    // calculaArea() {
    //     return this.altura * this.largura;
    // }
}

//* ========== SET UP DECK ==========
//? Variables only used in the functions below
var colorIndex = -1;

//? Main functions
function chooseCardNumber(index) {
    const CARD_NUMBER = Math.floor(index / QUANTITY_OF_CARDS_PER_NUMBER);
    if (CARD_NUMBER >= 0 && CARD_NUMBER < 10) {
        return CARD_NUMBER;
    } else {
        throw new Error("Received an invalid index");
    }
}

function chooseCardColor() {
    colorIndex == 3 ? (colorIndex = 0) : colorIndex++;
    return COLORS_ARRAY[colorIndex];
}

function includeInDeck(index, needsNumber, needsColor, special = SPECIALS_ARRAY[0]) {
    let number;
    let color;
    for (let cardIndex = 0; cardIndex < index; cardIndex++) {
        needsNumber === true
            ? (number = chooseCardNumber(cardIndex))
            : (number = needsNumber);
        needsColor === true
            ? (color = chooseCardColor())
            : (color = needsColor);
        DECK.push(new Card(number, color, OWNER_INDEX["deck"], special));
    }
}

//? Include cards in the deck

function includeNumbersInDeck() {
    includeInDeck(INITIAL_NUMBER_CARDS, true, true);
}

function includeSums2InDeck() {
    includeInDeck(INITIAL_COLORED_SPECIAL_CARDS, 2, true, SPECIALS_ARRAY[1]);
}

function includeBlocksInDeck() {
    includeInDeck(
        INITIAL_COLORED_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        true,
        SPECIALS_ARRAY[2]    );
}

function includeTurnsInDeck() {
    includeInDeck(
        INITIAL_COLORED_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        true,
        SPECIALS_ARRAY[3]
    );
}

function includeSum4InDeck() {
    includeInDeck(INITIAL_BLACK_SPECIAL_CARDS, 4, COLORS_ARRAY[4], SPECIALS_ARRAY[1]);
}

function includeChangeColorInDeck() {
    includeInDeck(
        INITIAL_BLACK_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        COLORS_ARRAY[4],
        SPECIALS_ARRAY[4]
    );
}

//? Calls all deck functions
function createDeck() {
    includeNumbersInDeck();
    includeSums2InDeck();
    includeBlocksInDeck();
    includeTurnsInDeck();
    includeSum4InDeck();
    includeChangeColorInDeck();
    DECK.sort(() => Math.random() - 0.5);
}

//* ========== GIVE FIRST CARDS ==========
function giveCards(whoOwns, array, qt) {
    for (
        let currentCard = 0;
        currentCard < qt;
        currentCard++
    ) {
        const ADDED_CARD = DECK.pop();
        ADDED_CARD.owner = whoOwns;
        array.push(ADDED_CARD);
    }
}

function createCenterCard() {
    let SELECTED_CARD = DECK.pop();
    while (SELECTED_CARD.special == "sum" || SELECTED_CARD.number == 10) {
        SELECTED_CARD = DECK.pop();
    }
    SELECTED_CARD.owner = 3;
    CENTER_CARD = SELECTED_CARD;
}

function firstCardsInArrays() {
    giveCards(OWNER_INDEX["player"], PLAYER_CARDS_ARRAY, INITIAL_CARDS_ON_HANDS);
    giveCards(OWNER_INDEX["bot1"], BOT1_CARDS_ARRAY, INITIAL_CARDS_ON_HANDS);
}

function visuallyIncludeCards () {
    visualModule.createPlayerFirstButtons(PLAYER_CARDS_ARRAY);
    visualModule.createBot1FirstDivs(BOT1_CARDS_ARRAY)
    visualModule.updateCentralCard(CENTER_CARD);
}

function createFirstCards() {
    firstCardsInArrays();
    createCenterCard();
    visuallyIncludeCards();
}

//*  ========== START GAME ==========
function startGame() {
    createDeck();
    createFirstCards();
    logInfo();
}

//* ========= LOGGING INFO ==========
function logInfo() {
    console.log(PLAYER_CARDS_ARRAY);
    console.log(BOT1_CARDS_ARRAY);
    console.log(DECK);
    console.log(CENTER_CARD);
}

//* ========= EXPORTS ==========
//? Exports to visualScript.js
export default {
    // functions
    startGame,
    chooseCardNumber,
    // Variables
    COLORS_ARRAY,
    SPECIALS_ARRAY,
    INITIAL_CARDS_ON_HANDS,
    NO_NUMBER_CARD_IDENTIFICATION,
};

//? Exports to script.test.js
// module.exports = {
//     chooseCardNumber,
// };