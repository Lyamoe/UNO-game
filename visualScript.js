//* ========== GET OTHER SCRIPT ==========
import gameModule from "./script.js";

//* ========= EXPORTS ==========
//? Exports to visualScript.js
export default {
    createBotFirstDivs,
    createPlayerFirstButtons,
};

//* ========== CREATE MAIN VARIABLES ==========
//? DOM
const BOT_HAND_DIV = document.getElementById("botcards");
const BOT_CARD_TO_CLONE = document.getElementById("botclone");
const PLAYER_HAND_DIV = document.getElementById("usercards");
const PLAYER_CARD_TO_CLONE = document.getElementById("userclone");
const BUY_CARDS_BTN = document.getElementById("back");
const START_BUTTON = document.getElementById("start");
const HOME_SCREEN = document.getElementById("home");
const MAIN_SCREEN = document.getElementById("main");

//? Imported variables
const PLAYER_CARD_INDEX = gameModule.PLAYER_CARD_INDEX;
const BOT_CARD_INDEX = gameModule.BOT_CARD_INDEX;
const DECK_CARD_INDEX = gameModule.DECK_CARD_INDEX;
const INITIAL_CARDS_ON_HANDS = gameModule.INITIAL_CARDS_ON_HANDS;

//? Other variables
const NONE_INDEX = 0;
const SUM_INDEX = 1;
const BLOCK_INDEX = 2;
const TURN_INDEX = 3;
const CHANGE_COLOR_INDEX = 4;
const RED_INDEX = 0;
const YELLOW_INDEX = 1;
const GREEN_INDEX = 2;
const BLUE_INDEX = 3;

//*  ========== TOGGLE HOMESCREEN ==========
function closeHomescreen() {
    HOME_SCREEN.style.display = "none";
    MAIN_SCREEN.style.display = "block";
}

//*  ========== CREATE CARD DIVS/BUTTONS ==========

//? Configure cards
function setCardSelectionFunction (btn){
    btn.onclick = function (event) {
        const buttonId = event.target.id;
        console.log("Player chose a card!");
        const clickedButton = document.getElementById(String(buttonId));
        clickedButton.remove();
        current = buttonId.slice(1);

    };
}

function configureSpan() {}

function giveSpecialCardANumber (special) {
    switch (special) {
        case "none":
            return NONE_INDEX;
        case "sum":
            return SUM_INDEX;
        case "block":
            return BLOCK_INDEX;
        case "turn":
            return TURN_INDEX;
        case "change colors":
            return CHANGE_COLOR_INDEX;
        default:
            throw new Error("Object has a different special attributte");
    }
}

function giveColorANumber (color) {
    switch (color) {
        case "red":
            return RED_INDEX;
        case "yellow":
            return YELLOW_INDEX;
        case "green":
            return GREEN_INDEX;
        case "blue":
            return BLUE_INDEX;
        default:
            throw new Error("Object has a different color attributte");
    }
}

function setCardId (card) {
    const cardNumber = card.number;
    const cardColor = giveColorANumber(card.color);
    const cardOwner = card.owner;
    const cardSpecial = giveSpecialCardANumber(card.special);
    return String(cardNumber + cardColor + cardOwner + cardSpecial);
}

//? Execute all of the above
function playerBuysCards(qt, array) {
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const newButton = playerClone.cloneNode(true);
        const newSpan = newButton.querySelector(".circle span");
        configureSpan(newSpan);
        setCardSelectionFunction(newButton);
        setCardId (array[currentCard]);
        newButton.disabled = true;
        newButton.style.display = "inline-block";
        PLAYER_HAND_DIV.appendChild(newButton);
    }
    
}

function botBuysCards(qt, array) {}

//? Create for the first time
function createPlayerFirstButtons(array) {
    playerBuysCards(INITIAL_CARDS_ON_HANDS, array);
}

function createBotFirstDivs(array) {
    botBuysCards(INITIAL_CARDS_ON_HANDS, array);
}

//*  ========== CARDS ACTIONS ==========
function removeClassUsable () {
    for (let searchCard of PLAYER_HAND_DIV) {
        if (
            searchCard &&
            searchCard.classList.contains("usable") &&
            searchCard.id === current
        ) {
            searchCard.classList.remove("usable");
            searchCard.disabled = true;
            break;
        }
    }
}

//*  ========== START GAME ==========
function callFirstFunctions() {
    closeHomescreen();
    gameModule.startGame();
}

START_BUTTON.onclick = callFirstFunctions;
