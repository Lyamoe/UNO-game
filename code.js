// create variables
var deck = [];
var rpt = 0;
var left = 63;
var current = "";
var currentColor = current.charAt(current.length - 1);
var currentNumber = current.charAt(0);
var playerCards = [];
var botCards = [];
var round = 1;

// SETTING UP TO START
async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createDeck() {
    for (let i = 0; i < 4; i++) {
        for (let col = 0; col < 14; col++) {
            if (col > 9 && col < 12) {
                deck[rpt] = "+2" + String(i);
            } else {
                if (col > 11) {
                    deck[rpt] = "b" + String(i);
                } else {
                    deck[rpt] = String(col) + String(i);
                }
            };
            rpt++
        };
    };
    
    for (let i = 0; i < 8; i++) {
        if (i > 3) {
            deck[rpt] = "+44"
        } else {
            deck[rpt] = "c4"
        }
        rpt++
    }
    
    deck.sort(() => Math.random() - 0.5);
}

function giveFirstCards() {
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
    console.log("Player cards: ", playerCards);
    console.log("Bot cards: ", botCards);
    console.log("Current card: ", current)
    console.log("current color: ", currentColor)
}

async function firstDivs() {
    const botDivs = document.getElementById('botcards');
    const playerDivs = document.getElementById('usercards');
      
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
async function updateCurrent() {

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
    await wait(4000)
}

async function playerTurn() {
    await wait(5600);

    for (let i = 0; i < playerCards.length; i++) {
        let str = "p" + playerCards[i];
        var searchCard = document.getElementById(String(str));
        console.log("Searching usable cards: ", searchCard);
        if (playerCards[i].charAt(playerCards[i].length - 1) == "4" ||
            playerCards[i].charAt(1) == currentNumber || playerCards[i].charAt(playerCards[i].length - 1) == currentColor){
            searchCard.classList.add("usable");
            searchCard.disabled = false;
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

    for (let i = 0; i < botCards.length; i++) {
        var searchColor = botCards[i].charAt(current.length - 1);
        var searchNumber = botCards[i].charAt(0);
        if (searchColor == currentColor || searchNumber == currentNumber) {
            current = botCards[i]
            var deleteCard = document.getElementById(String(botCards[i]));
            deleteCard.remove();
            botCards = botCards.filter(item => item !== current);    
            break;
        }
    }

    updateCurrent()
    await wait(1000)
    playerTurn()
}

function buyCard() {
  
}

function sumCheck(digit) {
  
}



    createDeck();
    giveFirstCards();
    firstDivs();
    playerTurn();