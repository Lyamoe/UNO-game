//* ========== GET OTHER SCRIPT ==========
import gameModule from "./script.js";

//* ========== CREATE MAIN VARIABLES ==========
//? DOM
const BOT1_HAND_DIV = document.getElementById("bot1cards");
const BOT1_CARD_TO_CLONE = document.getElementById("bot1clone");
const PLAYER_HAND_DIV = document.getElementById("usercards");
const PLAYER_CARD_TO_CLONE = document.getElementById("userclone");
const BUY_CARDS_BTN = document.getElementById("back");
const START_BUTTON = document.getElementById("start");
const HOME_SCREEN = document.getElementById("home");
const MAIN_SCREEN = document.getElementById("main");
const TOP_CARD = document.getElementById("top");

//? Imported variables
const PLAYERS = gameModule.PLAYERS;
const PLAYER_NAMES = gameModule.PLAYER_NAMES;
const COLORS_ARRAY = gameModule.COLORS_ARRAY;
const SPECIALS_ARRAY = gameModule.SPECIALS_ARRAY;
const INITIAL_CARDS_ON_HANDS = gameModule.INITIAL_CARDS_ON_HANDS;
const NO_NUMBER_CARD_IDENTIFICATION = gameModule.NO_NUMBER_CARD_IDENTIFICATION;

//? Other variables

//*  ========== TOGGLE HOMESCREEN ==========
function closeHomescreen() {
    HOME_SCREEN.style.display = "none";
    MAIN_SCREEN.style.display = "block";
}

//*  ========== CREATE CARD DIVS/BUTTONS ==========
//? Configure cards

function setCardSelectionFunction(btn) {
    btn.onclick = function (event) {
        const CLICKED_CARD_ID = event.target.id;
        const CLICKED_CARD = document.getElementById(String(CLICKED_CARD_ID));
        gameModule.handleChosenCard(CLICKED_CARD_ID, PLAYER_CARDS_ARRAY);
        CLICKED_CARD.remove();
    };
}

function findObjectByPlayerName(name){
for (const player of PLAYERS) {
    if (player.name == name) {
        return player;
    }
}
}

// function checkIfIconIsShown (i, span, special) {
//     if (!i.textContent.trim()) {
//         span.innerText = special;
//         i.remove();
//     }
// }

function createIconForSpecials(span, special) {
    const ICON = document.createElement("i");
    switch (special) {
        case SPECIALS_ARRAY[2]:
            ICON.className = "fa fa-ban";
            break;
        case SPECIALS_ARRAY[3]:
            ICON.className = "fas fa-arrows-rotate";
            break;
        case SPECIALS_ARRAY[4]:
            ICON.className = "fa-regular fa-circle-xmark";
            break;
        default:
            throw new Error("Special card not identified");
    }
    span.innerText = "";
    span.appendChild(ICON);
    // checkIfIconIsShown(ICON, span, special);
}

function configureSpan(btn, card) {
    const SPAN = btn.querySelector(".circle span");
    const BTN_NUMBER = card.number;
    if (BTN_NUMBER === NO_NUMBER_CARD_IDENTIFICATION) {
        createIconForSpecials(SPAN, card.special);
    } else {
        const SPAN_TEXT = BTN_NUMBER;
        const CARD_ID = btn.id;
        const ID_LENGTH = CARD_ID.length;
        SPAN.innerText =
            CARD_ID.charAt(ID_LENGTH - 1) == 1 ? "+" + SPAN_TEXT : SPAN_TEXT;
    }
}

function giveCardAColor(parent, card) {
    const CARD_COLOR = card.color;
    parent.classList.add(CARD_COLOR);
}

function resetCenterCardColor() {
    for (const color of COLORS_ARRAY) {
        if (TOP_CARD.classList.contains(color)) {
            TOP_CARD.classList.remove(color);
            break;
        }
    }
}

//? Execute all of the above
function playerBuysCards(qt) {
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const NEW_BTN = PLAYER_CARD_TO_CLONE.cloneNode(true);
        const USER = findObjectByPlayerName(PLAYER_NAMES[0]);
        const ARRAY = USER.cardsInHand;
        const SELECTED_CARD = ARRAY[ARRAY.length - (1 + currentCard)];
        setCardSelectionFunction(NEW_BTN);
        configureSpan(NEW_BTN, SELECTED_CARD);
        giveCardAColor(NEW_BTN, SELECTED_CARD);
        NEW_BTN.id = SELECTED_CARD.cardId();
        NEW_BTN.disabled = true;
        NEW_BTN.style.display = "inline-block";
        PLAYER_HAND_DIV.appendChild(NEW_BTN);
    }
}

function botBuysCards(qt, array, cloneCard) {
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const NEW_DIV = cloneCard.cloneNode(true);
        const SELECTED_CARD = array[array.length - (1 + currentCard)];
        NEW_DIV.id = SELECTED_CARD.cardId();
        NEW_DIV.style.display = "inline-block";
        BOT1_HAND_DIV.appendChild(NEW_DIV);
    }
}

function updateCentralCard(card) {
    TOP_CARD.Id = card.cardId();
    configureSpan(TOP_CARD, card);
    resetCenterCardColor();
    giveCardAColor(TOP_CARD, card);
}

//? Bot buying functions
function bot1BuysCards(qt) {
    const BOT1 = findObjectByPlayerName(PLAYER_NAMES[1]);
    const ARRAY = BOT1.cardsInHand;
    botBuysCards(qt, ARRAY, BOT1_CARD_TO_CLONE);
}

//? Create for the first time
function createPlayerFirstButtons() {
    playerBuysCards(INITIAL_CARDS_ON_HANDS);
}

function createBot1FirstDivs() {
    bot1BuysCards(INITIAL_CARDS_ON_HANDS);
}

//*  ========== START GAME ==========
function callFirstFunctions() {
    closeHomescreen();
    gameModule.startGame();
}

START_BUTTON.onclick = callFirstFunctions;

//* ========= EXPORTS ==========
//? Exports to script.js
export default {
    createBot1FirstDivs,
    createPlayerFirstButtons,
    updateCentralCard,
};
