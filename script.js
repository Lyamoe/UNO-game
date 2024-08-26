//* ========== CREATE VARIABLES ==========
//? DOM
// screen DOM
const START_BUTTON = document.getElementById("start");
const HOME_SCREEN = document.getElementById("home");
const MAIN_SCREEN = document.getElementById("main");
// bot DOM
const BOT_HAND_DIV = document.getElementById("botcards");
const BOT_CART_TO_CLONE = document.getElementById("botclone");
// player DOM
const PLAYER_HAND_DIV = document.getElementById("usercards");
const PLAYER_CARD_TO_CLONE = document.getElementById("userclone");
// others
const BUY_CARDS_BTN = document.getElementById("back");

//? Current cards
const DECK = [];
const PLAYER_CARDS_ARRAY = [];
const BOT_CARDS_ARRAY = [];
var current = "";
var currentColor = current.charAt(current.length - 1);
var currentNumber = current.charAt(0);

//? Setups
const QUANTITY_OF_CARDS_PER_NUMBER = 4;

//? Classes
class Card {
    constructor(number, color, owner, special = 0) {
        this.number = number;
        this.color = color;
        this.special = special;
        this.owner = owner;
        //* Owner: 1 = player; 2 = bot; 3 = game.
    }
    // get area() {
    //     return this.calculaArea();
    // }
    // calculaArea() {
    //     return this.altura * this.largura;
    // }
}

//* ========== SETUP GAME ==========
//? variables only used in this functions
var colorIndex = 0;

function chooseCardNumber (index){
    const CARD_NUMBER_INDEX = Math.floor(index / QUANTITY_OF_CARDS_PER_NUMBER);
    if (CARD_NUMBER_INDEX >= 0 || CARD_NUMBER_INDEX < 10){
        return CARD_NUMBER_INDEX
    }else {
        throw new Error("Received an invalid index");
    }
};

function chooseCardColor() {
    if (colorIndex == 4) {
        colorIndex = 1;
    } else {
        colorIndex++
    }

    switch (colorIndex) {
        case 1: return "red"
        case 2: return "red"
        case 3: return "red"
        case 4: return "red"
        default: throw new Error("Received a index lower that 1 or bigger than 4");
    }
}

function createDeck () {
    for (let numberCardIndex = 0; numberCardIndex < 40; numberCardIndex++) {
        const number = chooseCardNumber(numberCardIndex);
        const color = chooseCardColor();
        DECK.push = new Card(number, color, 3);
    }
    DECK.sort(() => Math.random() - 0.5);
    console.log(DECK);
}

createDeck()
//* ========= EXPORTS ==========
// export default chooseCardNumber;