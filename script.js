//* ========== GET OTHER SCRIPT ==========
import visualModule from "./visualScript.js";

//* ========= EXPORTS ==========
//? Exports to visualScript.js
export default {
    // functions
    startGame,
    chooseCardNumber,
    // Variables
    PLAYER_CARD_INDEX,
    BOT_CARD_INDEX,
    DECK_CARD_INDEX,
    INITIAL_CARDS_ON_HANDS,
};

//? Exports to script.test.js
// module.exports = {
//     chooseCardNumber,
// };

//* ========== CREATE MAIN VARIABLES ==========

//? Setups
const DECK = [];
const PLAYER_CARDS_ARRAY = [];
const BOT_CARDS_ARRAY = [];
const QUANTITY_OF_CARDS_PER_NUMBER = 4;
const INITIAL_CARDS_ON_HANDS = 7;
const INITIAL_NUMBER_CARDS = 40;
const INITIAL_COLORED_SPECIAL_CARDS = 8;
const INITIAL_BLACK_SPECIAL_CARDS = 2;
const NO_NUMBER_CARD_IDENTIFICATION = 10;
const PLAYER_CARD_INDEX = 1;
const BOT_CARD_INDEX = 2;
const DECK_CARD_INDEX = 3;

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
var colorIndex = 0;

//? Main functions
function chooseCardNumber(index) {
    const CARD_NUMBER_INDEX = Math.floor(index / QUANTITY_OF_CARDS_PER_NUMBER);
    if (CARD_NUMBER_INDEX >= 0 && CARD_NUMBER_INDEX < 10) {
        return CARD_NUMBER_INDEX;
    } else {
        throw new Error("Received an invalid index");
    }
}

function chooseCardColor() {
    colorIndex == 4 ? (colorIndex = 1) : colorIndex++;

    switch (colorIndex) {
        case 1:
            return "red";
        case 2:
            return "yellow";
        case 3:
            return "green";
        case 4:
            return "blue";
        default:
            throw new Error("Received a index lower that 1 or bigger than 4");
    }
}

function includeInDeck(index, needsNumber, needsColor, special = "none") {
    let number;
    let color;

    for (let cardIndex = 4; cardIndex < index; cardIndex++) {
        needsNumber === true
            ? (number = chooseCardNumber(cardIndex))
            : (number = needsNumber);
        needsColor === true
            ? (color = chooseCardColor())
            : (color = needsColor);
        DECK.push(new Card(number, color, DECK_CARD_INDEX, special));
    }
}

//? Include cards in the deck

function includeNumbersInDeck() {
    includeInDeck(INITIAL_NUMBER_CARDS, true, true);
}

function includeSums2InDeck() {
    includeInDeck(INITIAL_COLORED_SPECIAL_CARDS, 2, true, "sum");
}

function includeBlocksInDeck() {
    includeInDeck(
        INITIAL_COLORED_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        true,
        "block"
    );
}

function includeTurnsInDeck() {
    includeInDeck(
        INITIAL_COLORED_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        true,
        "turn"
    );
}

function includeSum4InDeck() {
    includeInDeck(INITIAL_BLACK_SPECIAL_CARDS, 4, "black", "sum");
}

function includeChangeColorInDeck() {
    includeInDeck(
        INITIAL_BLACK_SPECIAL_CARDS,
        NO_NUMBER_CARD_IDENTIFICATION,
        "black",
        "change colors"
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

function firstPlayerCards() {
    giveCards(PLAYER_CARD_INDEX, PLAYER_CARDS_ARRAY, INITIAL_CARDS_ON_HANDS);
}

function firstBotCards() {
    giveCards(BOT_CARD_INDEX, BOT_CARDS_ARRAY, INITIAL_CARDS_ON_HANDS);
}

function visuallyIncludeBotCards () {
    visualModule.createBotDivs(BOT_CARDS_ARRAY)
}

function visuallyIncludePlayerCards () {
    visualModule.createPlayerButtons(PLAYER_CARDS_ARRAY);
}

function createFirstCards() {
    firstPlayerCards();
    firstBotCards();
    visuallyIncludeBotCards();
    visuallyIncludePlayerCards();
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
    console.log(BOT_CARDS_ARRAY);
    console.log(DECK);
}