//TODO: Finish code starting on "chosen card options", everything above is finished

//* ========== GET OTHER SCRIPT ==========
import visualModule from "./visualScript.js";

//* ========== CREATE MAIN VARIABLES ==========
//? Setups
const BUY_CARDS_BTN = document.getElementById("back");
const OWNER_INDEX = {
    deck: 0,
    center: 1,
    user: 2,
    bot1: 3,
    bot2: 4,
    bot3: 5,
};
const DECK = [];
const PLAYERS = [];
const PLAYER_NAMES = ["user", "bot1", "bot2", "bot3"];
const COLORS_ARRAY = ["red", "yellow", "green", "blue", "black"];
const SPECIALS_ARRAY = ["none", "sum", "block", "turn", "changeColors"];
const DIRECTIONS_ARRAY = ["clockwise", "counter-clockwise"];
const NUMBER_OF_PLAYERS = 2; //TODO: Change to 4 after the game is working with 2
const QUANTITY_OF_CARDS_PER_NUMBER = 4;
const INITIAL_CARDS_ON_HANDS = 7;
const INITIAL_NUMBER_CARDS = 40;
const INITIAL_COLORED_SPECIAL_CARDS = 8;
const INITIAL_BLACK_SPECIAL_CARDS = 2;
const NO_NUMBER_CARD_IDENTIFICATION = 10; //? every special card except sums will have a 10 as number
let centerCard;
let addIndex = 0;
let direction = DIRECTIONS_ARRAY[0];
let isASumTurn = false;

//? Classes
class Card {
    constructor(number, color, owner, special) {
        this.number = number;
        this.color = color;
        this.owner = owner;
        this.special = special;
    }

    get cardId() {
        return this.setCardId;
    }
    setCardId() {
        const cardNumber = String(this.number);
        const cardColor = String(COLORS_ARRAY.indexOf(this.color));
        const cardOwner = String(this.owner);
        const cardSpecial = String(SPECIALS_ARRAY.indexOf(this.special));
        return cardNumber + cardColor + cardOwner + cardSpecial;
    }
}

class Player {
    constructor(name, turn) {
        this.name = name;
        this.turn = turn;
        this.ownerIndex = OWNER_INDEX[name];
        this.cardsInHand = [];
        this.isSkipped = false;
    }
    get nextTurn() {
        return this.addOneToNextTurn;
    }
    addOneToNextTurn() {
        if (this.turn == NUMBER_OF_PLAYERS - 1) {
            this.turn = 0;
        } else {
            this.turn++;
        }
    }
}

//* ========== SET UP PLAYERS ==========
function setPlayers() {
    for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
        const PLAYER = new Player(PLAYER_NAMES[i], i);
        PLAYERS.push(PLAYER);
    }
}

//* ========== SET UP DECK ==========
//? Variables only used in the functions below
let colorIndex = -1;

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

function includeInDeck(
    index,
    needsNumber,
    needsColor,
    special = SPECIALS_ARRAY[0]
) {
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
        SPECIALS_ARRAY[2]
    );
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
    includeInDeck(
        INITIAL_BLACK_SPECIAL_CARDS,
        4,
        COLORS_ARRAY[4],
        SPECIALS_ARRAY[1]
    );
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

//* ========== GIVE CARDS TO PLAYERS ==========
function deckNeedsToBeShuffled(qtOfCardsToBuy) {
    if (qtOfCardsToBuy > DECK.length) {
        createDeck();
    }
}

function giveCards(player, qt) {
    deckNeedsToBeShuffled(qt);
    const PLAYER_ARRAY = player.cardsInHand;
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const ADDED_CARD = DECK.pop();
        ADDED_CARD.owner = player.ownerIndex;
        PLAYER_ARRAY.push(ADDED_CARD);
    }
}

function createCenterCard() {
    let SELECTED_CARD = DECK.pop();
    while (SELECTED_CARD.special == "sum" || SELECTED_CARD.number == 10) {
        SELECTED_CARD = DECK.pop();
    }
    SELECTED_CARD.owner = OWNER_INDEX["center"];
    centerCard = SELECTED_CARD;
    visualModule.updateCentralCard(centerCard);
}

function firstCardsInArrays() {
    for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
        giveCards(PLAYERS[i], INITIAL_CARDS_ON_HANDS);
    }
}

function visuallyIncludeCards() {
    visualModule.createPlayerFirstButtons();
    visualModule.createBot1FirstDivs();
}

function createFirstCards() {
    firstCardsInArrays();
    createCenterCard();
    visuallyIncludeCards();
}

//* ========== ACCESSING INFO ===========
function findNextPlayerObject() {
    for (const player of PLAYERS) {
        if (player.turn == 1) {
            return player;
        }
    }
    throw new Error("Player was not found");
}

function locateAttributesWithId(cardId) {
    const ID_LENGTH = cardId.length;
    const NUMBER_IDENTIFICATOR = cardId.slice(0, -3);
    const COLOR_IDENTIFICATOR = cardId.charAt(ID_LENGTH - 3);
    const OWNER_IDENTIFICATOR = cardId.charAt(ID_LENGTH - 2);
    const SPECIAL_IDENTIFICATOR = cardId.charAt(ID_LENGTH - 1);
    const COLOR_NAME = COLORS_ARRAY[parseInt(COLOR_IDENTIFICATOR)];
    const SPECIAL_NAME = SPECIALS_ARRAY[parseInt(SPECIAL_IDENTIFICATOR)];
    return [
        NUMBER_IDENTIFICATOR,
        COLOR_NAME,
        OWNER_IDENTIFICATOR,
        SPECIAL_NAME,
    ];
}

//! select card is returning this
function findCorrespondentCardObject(cardId, array) {
    const ATTRIBUTTES_ARRAY = locateAttributesWithId(cardId);
    for (const object of array) {
        if (
            object.number == ATTRIBUTTES_ARRAY[0] &&
            object.color == ATTRIBUTTES_ARRAY[1] &&
            object.owner == ATTRIBUTTES_ARRAY[2] &&
            object.special == ATTRIBUTTES_ARRAY[3]
        ) {
            return object;
        }
    }
    throw new ReferenceError("Object was not found");
}

//* ========== CHOSEN CARD OPTIONS ==========
function removeCardFromArray(object, array) {
    for (const card of array) {
        if (card === object) {
            array.splice(array.indexOf(card), 1);
            break;
        }
    }
}

function updateCentralCardVariable(card) {
    centerCard = card;
    visualModule.updateCentralCard(card);
}

function checkIfPlayerHasSumCard(array) {
    for (const card of array) {
        if (card.special == SPECIALS_ARRAY[1]) {
            return true;
        }
    }
    return false;
}

function sumCardSelected(nextPlayer, sumNumber) {
    addIndex += sumNumber;
    isASumTurn = true;
    const HAS_SUM_CARD = checkIfPlayerHasSumCard(nextPlayer.cardsInHand);
    if (HAS_SUM_CARD) {
        nextPlayer.isSkipped = false;
    } else {
        giveCards(nextPlayer, addIndex);
        addIndex = 0;
        nextPlayer.isSkipped = true;
        isASumTurn = false;
    }
}

function blockCardSelected(nextPlayer) {
    nextPlayer.isSkipped = true;
}

function changeDirection() {
    if (direction == DIRECTIONS_ARRAY[0]) {
        direction = DIRECTIONS_ARRAY[1];
    } else {
        direction = DIRECTIONS_ARRAY[0];
    }
}

function turnCardSelected() {
    for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
        const TURN = PLAYERS[i].turn;
        switch (TURN) {
            case 0:
                PLAYERS[i].turn = PLAYERS.length - 1;
                break;
            case 1:
                PLAYERS[i].turn = PLAYERS.length - 2;
                break;
            case 2:
                PLAYERS[i].turn = PLAYERS.length - 3;
                break;
            case 3:
                PLAYERS[i].turn = PLAYERS.length - 4;
                break;
            default:
                throw new Error("The turn is higher than it should be");
        }
    }
    changeDirection();
}

//TODO: set the functions in visualModule
function playerSelectedColor(color) {
    centerCard.color = color;
    visualModule.updateCentralCard(centerCard);
    visualModule.closeColorSelectionScreen();
}

function changeColorsCardSelected() {
    visualModule.openColorSelectionScreen();
}

function redirectToSpecialFunction(cardObject) {
    const NUMBER = cardObject.number;
    const SPECIAL = cardObject.special;
    const NEXT_PLAYER = findNextPlayerObject();

    switch (SPECIAL) {
        case SPECIALS_ARRAY[0]:
            break;
        case SPECIALS_ARRAY[1]:
            sumCardSelected(NEXT_PLAYER, NUMBER);
            break;
        case SPECIALS_ARRAY[2]:
            blockCardSelected(NEXT_PLAYER);
            break;
        case SPECIALS_ARRAY[3]:
            turnCardSelected();
            break;
        case SPECIALS_ARRAY[4]:
            changeColorsCardSelected();
            break;
        default:
            throw new ReferenceError("Special was not identified");
    }
}

function handleChosenCard(cardId, array) {
    const SELECTED_OBJECT = findCorrespondentCardObject(cardId, array);
    updateCentralCardVariable(SELECTED_OBJECT);
    redirectToSpecialFunction(SELECTED_OBJECT);
    removeCardFromArray(SELECTED_OBJECT, array);
}

//*  ========== IN GAME ==========
function nextTurn() {
    logInfo();
    let nextPlayerName;
    for (const player of PLAYERS) {
        const TURN = player.turn;
        switch (TURN) {
            case 0:
                player.turn = PLAYERS.length - 1;
                nextPlayerName = player.name;
            case 1:
                player.turn = 0;
                break;
            case 2:
                player.turn = 1;
                break;
            case 3:
                player.turn = 2;
                break;
            default:
                throw new RangeError("The turn is higher than it should be");
        }
    }
    return nextPlayerName;
}

function callPlayerTurnFunction() {
    const WHO_PLAYS_NEXT = nextTurn();
    switch (WHO_PLAYS_NEXT) {
        case PLAYER_NAMES[0]:
            playerTurn();
            break;
        case PLAYER_NAMES[1]:
            bot1Turn();
            break;
        case PLAYER_NAMES[2]:
            bot2Turn();
            break;
        case PLAYER_NAMES[3]:
            bot3Turn();
            break;
        default:
            break;
    }
}

function basicBotTurn(array) {
    callPlayerTurnFunction();
}

function bot1Turn() {
    basicBotTurn(PLAYERS[1].cardsInHand);
}
function bot2Turn() {
    basicBotTurn(PLAYERS[2].cardsInHand);
}
function bot3Turn() {
    basicBotTurn(PLAYERS[3].cardsInHand);
}

function manuallyBuying(canPlayACard) {
    if (!canPlayACard) {
        BUY_CARDS_BTN.disabled = false;
        //TODO: set up the buy cards button to max two or your turn is skipped
    }
}

//! NOT WORKING: it is turning random cards available
function playerTurn() {
    let userCanPlayACard = false;
    for (const card of PLAYERS[0].cardsInHand) {
        if (isASumTurn) {
            if (card.special === SPECIALS_ARRAY[1]) {
                const CARD_HTML = document.getElementById(String(card.cardId));
                CARD_HTML.classList.add("usable");
                CARD_HTML.disabled = false;
                userCanPlayACard = true;
            }
        } else {
            if (
                card.number == centerCard.number ||
                card.color == centerCard.color ||
                card.color == COLORS_ARRAY[4] ||
                card.special == centerCard.special
            ) {
                const CARD_ID = card.cardId();
                const CARD_HTML = document.getElementById(CARD_ID);
                CARD_HTML.classList.add("usable");
                CARD_HTML.disabled = false;
                userCanPlayACard = true;
            }
        }
    }
    manuallyBuying(userCanPlayACard);
}

//*  ========== START GAME ==========
//? Variables only used in this section
let round = 1;

function playerStillHasCards(array) {
    if (array.length == 0) {
        return false;
    }
    return true;
}

function roundsConfig() {
    playerTurn();
}

function startGame() {
    setPlayers();
    createDeck();
    createFirstCards();
    logInfo();
    roundsConfig();
}

//* ========= LOGGING INFO ==========
function logInfo() {
    console.clear();
    console.group("This round's cards:");
    for (let i = 0; i < PLAYERS.length; i++) {
        console.table(PLAYERS[i].cardsInHand);
    }
    console.table(DECK);
    console.log(centerCard);
    console.groupEnd();
}

//* ========= EXPORTS ==========
//? Exports to visualScript.js
export default {
    // functions
    startGame,
    handleChosenCard,
    playerSelectedColor,
    chooseCardNumber,
    // Variables
    centerCard,
    PLAYERS,
    PLAYER_NAMES,
    COLORS_ARRAY,
    SPECIALS_ARRAY,
    INITIAL_CARDS_ON_HANDS,
    NO_NUMBER_CARD_IDENTIFICATION,
};

//? Exports to script.test.js
// module.exports = {
//     chooseCardNumber,
// };
