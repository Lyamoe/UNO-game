// create variables
const botDivs = document.getElementById('botcards');
const playerDivs = document.getElementById('usercards');
const buyDeck = document.getElementById('back');
var deck = [];
var rpt = 0;
var left = 48;
var current = "";
var currentColor = current.charAt(current.length - 1);
var currentNumber = current.charAt(0);
var playerCards = [];
var botCards = [];
var round = 1;
var sumUp = 0
var bought = true

// SETTING UP TO START
async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDeck() {
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
            };
            rpt++
        };
    };
    
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
    updateCurrent()
    logCards()
}

function logCards() {
    console.table(deck)
    console.log("Player cards: ", playerCards);
    console.log("Bot cards: ", botCards);
    console.log("Current card: ", current)
    console.log("current color: ", currentColor)
}

async function firstDivs() {
    if (botDivs && playerDivs) {
        for (let i = 0; i < 7; i++) {
            var newButton = document.createElement("button");
            newButton.disabled = true;
            
            if (playerCards[i].charAt(0) == "+"){
                newButton.innerText = playerCards[i].charAt(0) + playerCards[i].charAt(1);
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

            newButton.addEventListener("click", function() {
                console.log("Button clicked!");
                const buttonId = event.target.id;
                const clickedButton = document.getElementById(String(buttonId))
                clickedButton.remove();
                current = buttonId.slice(1)

                for (let i = 0; i < playerCards.length; i++) {
                    let str = "p" + playerCards[i];
                    let searchCard = document.getElementById(str);
                    console.log("Searching non usable cards: ", searchCard);
                  
                    if (searchCard && searchCard.classList.contains("usable")) {
                      searchCard.classList.remove("usable");
                      searchCard.disabled = true;
                    }
                  }
                  
                updateCurrent();
                playerCards = playerCards.filter(item => item !== current);
    
                botTurn();
            });
              
            var colorCode = playerCards[i].charAt(playerCards[i].length - 1);
    
            switch(colorCode){
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
        for (let i = 0; i < 7; i++) {
            var newDiv = document.createElement("div");
            newDiv.id = String(botCards[i]);
            newDiv.classList.add("card");
            newDiv.classList.add("bot");
            botDivs.appendChild(newDiv);
            await wait(400);
        }
    } else {
        console.error("Error: Element(s) not found. Check your HTML IDs.");
    }
}


// GAME STARTED
function updateCurrent() {

    if (round == 1) {
        current = deck[left];
        currentColor = current.charAt(current.length - 1);
        specialCheck = current.charAt(0)
            
        if  (currentColor != "4" && specialCheck != "+" && specialCheck != "b" ) {
            deck.pop();
            left--;
        } else {
            for (let i = 0; i < left; i++) {
                current = deck[left - i];
                currentColor = current.charAt(current.length - 1);
                specialCheck = current.charAt(0)

                if  (currentColor != "4" && specialCheck != "+" && specialCheck != "b" ) {
                    deck = deck.filter(item => item !== current);
                    left--;
                    break;
                }
            }
        }
    }
    
    const topCard = document.getElementById('top');
    currentColor = current.charAt(current.length - 1);
    currentNumber = current.charAt(0);

    if (current.charAt(0) == "+"){
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
    
    if (topCard.classList.contains("red")){
        topCard.classList.remove("red");
    }
    if (topCard.classList.contains("yellow")){
        topCard.classList.remove("yellow");
    }
    if (topCard.classList.contains("green")){
        topCard.classList.remove("green");
    }
    if (topCard.classList.contains("blue")){
        topCard.classList.remove("blue");
    }
    if (topCard.classList.contains("black")){
        topCard.classList.remove("black");
    }

    switch (currentColor){
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
}

async function playerTurn() {
    if (round == 1) {
        await wait(5600);
        var sum = 10
    } else {
        var sum = sumCheck(1)
    }

    round++

    if (sum == "sum" && bought == false){
        for (let i = 0; i < playerCards.length; i++) {
            let str = "p" + playerCards[i];
            var searchCard = document.getElementById(String(str));
            var searchNumber = playerCards[i].charAt(0);
            console.log("Searching usable cards: ", searchCard);
    
            if (searchNumber == "+") {
                searchCard.classList.add("usable");
                searchCard.disabled = false;
            } else {
                if (i == playerCards.length - 1){
                    console.log("taking ", sumUp, " cards")
                    buyCard(1, sumUp)
                    bought = true
                    sumUp = 0
                }
            }
        }
    } else {
        for (let i = 0; i < playerCards.length; i++) {
            let str = "p" + playerCards[i];
            var searchCard = document.getElementById(String(str));
            console.log("Searching usable cards: ", searchCard);

            if (playerCards[i].charAt(playerCards[i].length - 1) == "4" || 
            playerCards[i].charAt(1) == currentNumber ||
            playerCards[i].charAt(playerCards[i].length - 1) == currentColor) {
                searchCard.classList.add("usable");
                searchCard.disabled = false;
                buyDeck.disabled = true;
            }

            
        }
        var nonusable = document.querySelectorAll(".usable");
        if (nonusable.length == 0){
            buyDeck.disabled = false;
        }
    }
}

async function playerChoise(){
    const buttonId = event.target.id;
    const clickedButton = document.getElementById(String(buttonId))
    clickedButton.remove();
    current = buttonId.slice(1)

    for (let i = 0; i < playerCards.length; i++) {
        let str = "p" + playerCards[i];
        let searchCard = document.getElementById(String(str));
        console.log("Searching non usable cards: ", searchCard);

        if (searchCard.classList.contains("usable")){
            searchCard.classList.remove("usable");
            searchCard.disabled = true;
        }
    }

    updateCurrent();
    playerCards = playerCards.filter(item => item !== current);
    await wait(4000)
    botTurn();
}

async function botTurn() {
    round++
    let sum = sumCheck(1)
    if (sum == "sum" && bought == false){
        for (let i = 0; i < botCards.length; i++) {
            var searchNumber = botCards[i].charAt(0);
    
            if (searchNumber == "+") {
                current = botCards[i];
                var deleteCard = document.getElementById(String(botCards[i]));
                deleteCard.remove();
                botCards = botCards.filter(item => item !== current);    
                break;
            } else {
                if (i == botCards.length - 1){
                    console.log("taking ", sumUp, " cards");
                    buyCard(2, sumUp);
                    bought = true;
                    sumUp = 0;
                }
            }
        }
    } else {
        for (let i = 0; i < botCards.length; i++) {
            var searchColor = botCards[i].charAt(current.length - 1);
            var searchNumber = botCards[i].charAt(0);
    
            if (searchColor == currentColor || searchNumber == currentNumber) {
                current = botCards[i];
                var deleteCard = document.getElementById(String(botCards[i]));
                deleteCard.remove();
                botCards = botCards.filter(item => item !== current);    
                break;
            }

            if (i == botCards[i].length-1) {
                buyCard(2,1)
                break;
            }
        }
    }

    await wait(4000);
    updateCurrent();
    playerTurn();
}

async function buyCard(who, qt) {
    if (who == 1) {
        for (let i = 0; i < qt; i++) {
            playerCards.push(deck[left]);
            console.log(deck)
            deck.pop();
            left--;

            var newButton = document.createElement("button");
            newButton.disabled = true;
            
            if (playerCards[i].charAt(0) == "+"){
                newButton.innerText = playerCards[i].charAt(0) + playerCards[i].charAt(1);
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
    
            newButton.addEventListener("click", function() {
                console.log("Button clicked!");
                const buttonId = event.target.id;
                const clickedButton = document.getElementById(String(buttonId))
                clickedButton.remove();
                current = buttonId.slice(1)
    
                for (let i = 0; i < playerCards.length; i++) {
                    let str = "p" + playerCards[i];
                    let searchCard = document.getElementById(str);
                    console.log("Searching non usable cards: ", searchCard);
                  
                    if (searchCard && searchCard.classList.contains("usable")) {
                      searchCard.classList.remove("usable");
                      searchCard.disabled = true;
                    }
                  }
                  
                updateCurrent();
                playerCards = playerCards.filter(item => item !== current);
    
                botTurn();
            });
              
            var colorCode = playerCards[i].charAt(playerCards[i].length - 1);
    
            switch(colorCode){
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
        botTurn();
        return;
    } else {
        for (let i = 0; i < qt; i++) {
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
        playerTurn();
        return;
    }
}

function sumCheck() {
    if (current.charAt(0) == "+"){
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


createDeck();
giveFirstCards();
firstDivs();
playerTurn();