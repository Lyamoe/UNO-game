//* Create variables
//? DOM
const botDivs = document.getElementById("botcards");
const botClone = document.getElementById("botclone");
const playerDivs = document.getElementById("usercards");
const playerClone = document.getElementById("userclone");
const buyDeck = document.getElementById("back");

//? Current cards
var deck = [];
var playerCards = [];
var botCards = [];
var current = "";
var currentColor = current.charAt(current.length - 1);
var currentNumber = current.charAt(0);

//? Others
var rpt = 0;
var left = 52;
var round = 1;
var sumUp = 0;
var bought = true;
var manualBuying = 0;
var sum = 10;

//? Timer
async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//? Game setup
function createDeck() {
    for (let i = 0; i < 4; i++) {
        for (let col = 0; col <= 11; col++) {
            if (col == 10) {
                deck[rpt] = "+2" + String(i);
            } else {
                if (col == 11) {
                    deck[rpt] = "b" + String(i);
                } else {
                    deck[rpt] = String(col) + String(i);
                }
            }
            rpt++;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (i > 1) {
            deck[rpt] = "+4" + i + "4";
        } else {
            deck[rpt] = "c" + i + "4";
        }
        rpt++;
    }
    deck.sort(() => Math.random() - 0.5);
}

function giveFirstCards() {
    left = deck.length - 1;
    for (let i = 0; i < 7; i++) {
        playerCards[i] = deck[left];
        deck.pop();
        left--;
        botCards[i] = deck[left];
        deck.pop();
        left--;
    }
    updateCurrent();
}

function logCards() {
    console.info("Player cards: ", playerCards);
    console.info("Bot cards: ", botCards);
    console.info("Cards left: ", left);
    console.info("Current number: ", currentNumber);

    switch (currentColor) {
        case "0":
            console.info("Current color: red");
            break;
        case "1":
            console.info("Current color: yellow");
            break;
        case "2":
            console.info("Current color: green");
            break;
        case "3":
            console.info("Current color: blue");
            break;
        case "4":
            console.info("Current color: black");
            break;
    }
}

async function firstDivs() {
    buyCard(1, 7);
    await wait (2800);
    buyCard(2, 7);
    await wait (2800);
    playerTurn()
}

// GAME STARTED
function updateCurrent() {
    if (round == 1) {
        current = deck[left];
        currentColor = current.charAt(current.length - 1);
        specialCheck = current.charAt(0);
        
        for (let i = 0; i < left; i++) {
            if (currentColor != "4" && specialCheck != "+" && specialCheck != "b") {
                deck = deck.filter((item) => item !== current);
                left--;
                break;
            }
        }
    }

    const topCard = document.getElementById("top");
    currentColor = current.charAt(current.length - 1);
    currentNumber = current.charAt(0);

    if (current.charAt(0) == "+") {
        topCard.innerText = current.charAt(0) + current.charAt(1);
        currentNumber = current.charAt(0) + current.charAt(1);
    } else {
        if (current.charAt(0) == "b") {
            // Switch to img
            topCard.innerText = "block";
            currentNumber = current.charAt(0);
        } else {
            if (current.charAt(0) == "c") {
                // Switch to img
                topCard.innerText = "change colors";
                currentNumber = current.charAt(0);
            } else {
                topCard.innerText = current.charAt(0);
                currentNumber = current.charAt(0);
            }
        }
    }

    if (topCard.classList.contains("red")) {
        topCard.classList.remove("red");
    }
    if (topCard.classList.contains("yellow")) {
        topCard.classList.remove("yellow");
    }
    if (topCard.classList.contains("green")) {
        topCard.classList.remove("green");
    }
    if (topCard.classList.contains("blue")) {
        topCard.classList.remove("blue");
    }
    if (topCard.classList.contains("black")) {
        topCard.classList.remove("black");
    }

    switch (currentColor) {
        case "0":
            topCard.classList.add("red");
            break;
        case "1":
            topCard.classList.add("yellow");
            break;
        case "2":
            topCard.classList.add("green");
            break;
        case "3":
            topCard.classList.add("blue");
            break;
        case "4":
            topCard.classList.add("black");
            break;
    }
    logCards();
}

async function playerTurn() {
    console.log("Begining of player turn");
    round++;

    if (sum == "sum" && bought == false) {
        for (let i = 0; i < playerCards.length; i++) {
            let str = "p" + playerCards[i];
            var searchCard = document.getElementById(String(str));
            var searchNumber = playerCards[i].charAt(0);
            console.log("Checking card ", i);

            if (searchNumber && searchNumber == "+") {
                searchCard.classList.add("usable");
                searchCard.disabled = false;
            } else {
                if (i == playerCards.length - 1) {
                    console.log("Player taking ", sumUp, " cards");
                    let confirm = buyCard(1, sumUp);
                    await wait(sumUp * 450);
                    if (confirm == true) {
                        botTurn();
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < playerCards.length; i++) {
            let str = "p" + playerCards[i];
            var searchCard = document.getElementById(String(str));
            let cardColor = playerCards[i].charAt(playerCards[i].length - 1);
            let cardNumber = playerCards[i].charAt(0);

            if (
                cardColor == "4" ||
                cardNumber == currentNumber ||
                cardColor == currentColor
            ) {
                searchCard.classList.add("usable");
                searchCard.disabled = false;
                buyDeck.disabled = true;
            }
        }
        var nonusable = document.querySelectorAll(".usable");
        if (nonusable.length == 0) {
            buyDeck.disabled = false;
        }
    }
    console.log("End of player script. Select or buy a card");
}

async function botTurn() {
    round++;
    console.log("Begining of bot turn");

    if (sum == "sum" && bought == false) {
        for (let i = 0; i < botCards.length; i++) {
            var searchNumber = botCards[i].charAt(0);

            if (searchNumber && searchNumber == "+") {
                current = botCards[i];
                var deleteCard = document.getElementById(String(botCards[i]));
                if (deleteCard) {
                    deleteCard.remove();
                }
                botCards = botCards.filter((item) => item !== current);
                console.log("Bot has a sum card");
                sum = sumCheck();
                break;
            } else {
                if (i == botCards.length - 1) {
                    console.log("bot taking ", sumUp, " cards");
                    let confirm = buyCard(2, sumUp);
                    await wait(sumUp * 450);
                    if (confirm == true) {
                        botTurn();
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < botCards.length; i++) {
            var searchColor = botCards[i].charAt(current.length - 1);
            var searchNumber = botCards[i].charAt(0);

            if (
                searchColor == currentColor ||
                searchNumber == currentNumber ||
                searchColor == "4"
            ) {
                current = botCards[i];
                var deleteCard = document.getElementById(String(botCards[i]));
                deleteCard.remove();
                botCards = botCards.filter((item) => item !== current);
                console.log("Bot plays a card");
                sum = sumCheck();
                break;
            }

            if (i == botCards[i].length - 1) {
                buyCard(2, 1);
                console.log("Bot buys a card");
                break;
            }
        }
    }

    console.log("End of bot turn");
    await wait(4000);
    updateCurrent();
    playerTurn();
}

//! Fix this one
async function buyCard(who, qt) {
    if (who == 1) {
        if (qt == 1) {
            manualBuying++;
        }

        if (manualBuying < 3) {
            let actualLength = playerCards.length;
            for (let i = actualLength; i < actualLength + qt; i++) {
                if (deck[left] == undefined) {
                    createDeck();
                }

                console.info("Player is buying: ", deck[left]);
                await wait(100);
                playerCards.push(deck[left]);
                deck.pop();
                left--;

                var newButton = document.createElement("button");
                newButton.disabled = true;

                if (playerCards[i].charAt(0) == "+") {
                    newButton.innerText =
                        playerCards[i].charAt(0) + playerCards[i].charAt(1);
                } else {
                    if (playerCards[i].charAt(0) == "b") {
                        // SWITCH TO IMAGE
                        newButton.innerText = "block";
                    } else {
                        if (playerCards[i].charAt(0) == "c") {
                            newButton.innerText = "change colors";
                        } else {
                            newButton.innerText = playerCards[i].charAt(0);
                        }
                    }
                }
                newButton.id = "p" + String(playerCards[i]);
                newButton.classList.add("card");
                newButton.classList.add("player");

                newButton.addEventListener("click", function () {
                    console.log("Player chose a card!");
                    const buttonId = event.target.id;
                    const clickedButton = document.getElementById(
                        String(buttonId)
                    );
                    clickedButton.remove();
                    current = buttonId.slice(1);

                    for (let i = 0; i < playerCards.length; i++) {
                        let str = "p" + playerCards[i];
                        let searchCard = document.getElementById(String(str));
                        console.log("Disable buttons!");

                        if (
                            searchCard &&
                            searchCard.classList.contains("usable")
                        ) {
                            searchCard.classList.remove("usable");
                            searchCard.disabled = true;
                        }
                    }

                    updateCurrent();
                    sum = sumCheck();
                    logCards();
                    playerCards = playerCards.filter(
                        (item) => item !== current
                    );
                    botTurn();
                });

                var colorCode = playerCards[i].charAt(
                    playerCards[i].length - 1
                );

                switch (colorCode) {
                    case "0":
                        newButton.classList.add("red");
                        break;
                    case "1":
                        newButton.classList.add("yellow");
                        break;
                    case "2":
                        newButton.classList.add("green");
                        break;
                    case "3":
                        newButton.classList.add("blue");
                        break;
                    default:
                        newButton.classList.add("black");
                        break;
                }

                playerDivs.appendChild(newButton);
                await wait(400);
            }
            bought = true;
            console.log("Player has finished buying: ", confirm);
            sumUp = 0;
            return true;
        } else {
            botTurn();
        }
    } else {
        let actualLength = botCards.length;
        for (let i = actualLength; i < actualLength + qt; i++) {
            if (deck[left] == undefined) {
                createDeck();
            }
            console.info("Bot is buying: ", deck[left]);
            await wait(100);
            botCards.push(deck[left]);
            deck.pop();
            left--;

            var newDiv = document.createElement("div");
            newDiv.id = String(botCards[i]);
            newDiv.classList.add("card");
            newDiv.classList.add("bot");
            botDivs.appendChild(newDiv);
            await wait(400);
        }
        bought = true;
        sumUp = 0;
        console.log("Bot has finished buying: ", confirm);
        return true;
    }
}

function sumCheck() {
    if (current.charAt(0) == "+") {
        sumUp = sumUp + parseInt(current.charAt(1));
        console.log("needs to be sum up");
        bought = false;
        return "sum";
    } else {
        console.log("don't need to be sum up");
        bought = true;
        return "nosum";
    }
}

if (round == 1) {
    createDeck();
    giveFirstCards();
    firstDivs();
}
playerTurn();
