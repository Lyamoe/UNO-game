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
        const buttonId = event.target.id;
        console.log("Player chose a card!");
        const CLICKED_CARD = document.getElementById(String(buttonId));
        CLICKED_CARD.remove();
    };
}

function giveSpecialCardANumber(special) {
    return SPECIALS_ARRAY.indexOf(special);
}

function giveColorANumber(color) {
    return COLORS_ARRAY.indexOf(color);
}

function setCardId(btn, card) {
    const cardNumber = String(card.number);
    const cardColor = String(giveColorANumber(card.color));
    const cardOwner = String(card.owner);
    const cardSpecial = String(giveSpecialCardANumber(card.special));
    btn.id = cardNumber + cardColor + cardOwner + cardSpecial;
}

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

function resetCenterCardColor(card) {
    const CARD_COLOR = card.color;
    if (TOP_CARD.classList.contains(CARD_COLOR)) {
        TOP_CARD.classList.remove(CARD_COLOR);
    }
}

//? Execute all of the above
function playerBuysCards(qt, array) {
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const NEW_BTN = PLAYER_CARD_TO_CLONE.cloneNode(true);
        const SELECTED_CARD = array[currentCard];
        setCardSelectionFunction(NEW_BTN);
        setCardId(NEW_BTN, SELECTED_CARD);
        configureSpan(NEW_BTN, SELECTED_CARD);
        giveCardAColor(NEW_BTN, SELECTED_CARD);
        NEW_BTN.disabled = true;
        NEW_BTN.style.display = "inline-block";
        PLAYER_HAND_DIV.appendChild(NEW_BTN);
    }
}

function bot1BuysCards(qt, array) {
    for (let currentCard = 0; currentCard < qt; currentCard++) {
        const NEW_DIV = BOT1_CARD_TO_CLONE.cloneNode(true);
        const SELECTED_CARD = array[currentCard];
        setCardId(NEW_DIV, SELECTED_CARD);
        BOT1_HAND_DIV.appendChild(NEW_DIV);
    }
}

function updateCentralCard(card) {
    setCardId(TOP_CARD, card);
    configureSpan(TOP_CARD, card);
    resetCenterCardColor(card);
    giveCardAColor(TOP_CARD, card);
}

//? Create for the first time
function createPlayerFirstButtons(array) {
    playerBuysCards(INITIAL_CARDS_ON_HANDS, array);
}

function createBot1FirstDivs(array) {
    bot1BuysCards(INITIAL_CARDS_ON_HANDS, array);
}

//*  ========== CARDS ACTIONS ==========

function sumCardSelected() {}

function blockCardSelected() {}

function turnCardSelected() {}

function changeColorsCardSelected() {}

//*  ========== IN GAME ==========

function playerTurn() {
    //* Configure special cards before this one since you'll have to check if the center
    //* card is a special card before the player can choose what they'll be using

    // if (sum == "sum" && bought == false) {
    //     for (let i = 0; i < playerCards.length; i++) {
    //         let str = "p" + playerCards[i];
    //         var searchCard = document.getElementById(String(str));
    //         var searchNumber = playerCards[i].charAt(0);
    //         console.log("Checking card ", i);
    //         if (searchNumber && searchNumber == "+") {
    //             searchCard.classList.add("usable");
    //             searchCard.disabled = false;
    //         } else {
    //             if (i == playerCards.length - 1) {
    //                 console.log("Player taking ", sumUp, " cards");
    //                 let confirm = buyCard(1, sumUp);
    //                 if (confirm == true) {
    //                     botTurn();
    //                 }
    //             }
    //         }
    //     }
    // } else {
    //     for (let i = 0; i < playerCards.length; i++) {
    //         var searchCard = document.getElementById(
    //             String("p" + playerCards[i])
    //         );
    //         let cardColor = playerCards[i].charAt(playerCards[i].length - 1);
    //         let cardNumber = playerCards[i].charAt(0);
    //         if (
    //             searchCard &&
    //             (cardColor == "4" ||
    //                 cardNumber == currentNumber ||
    //                 cardColor == currentColor)
    //         ) {
    //             searchCard.classList.add("usable");
    //             searchCard.disabled = false;
    //             buyDeck.disabled = true;
    //         } else {
    //             console.error("card wasn't found");
    //         }
    //     }
    //     var nonusable = document.querySelectorAll(".usable");
    //     if (nonusable.length == 0) {
    //         buyDeck.disabled = false;
    //     }
    // }
}

//*  ========== START GAME ==========
function callFirstFunctions() {
    closeHomescreen();
    gameModule.startGame();
}

START_BUTTON.onclick = callFirstFunctions;

//* ========= EXPORTS ==========
//? Exports to visualScript.js
export default {
    createBot1FirstDivs,
    createPlayerFirstButtons,
    updateCentralCard,
};
