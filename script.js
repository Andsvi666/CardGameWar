const start = document.querySelector('.button');
const results = document.querySelector('.results');
const num1Window = document.querySelector('#num1');
const num2Window = document.querySelector('#num2');
const num3Window = document.querySelector('#num3');
const num4Window = document.querySelector('#num4');
const computerCardsWindow = document.querySelector('#cards1');
const computerWonWindow = document.querySelector('#cards2');
const playerCardsWindow = document.querySelector('#cards3');
const playerWonWindow = document.querySelector('#cards4');
const battleCard1Window = document.querySelector('#cards5');
const battleCard2Window = document.querySelector('#cards6');

document.getElementById('cards3').disabled = true;

const pattern = "XXXXXXX<br>XXXXXXX<br>XXXXXXX<br>XXXXXXX";
let deck = [];
let computerDeck = [];
let playerDeck = [];
let computerNewDeck = [];
let playerNewDeck = [];
let computerCardsCount;
let playerCardsCount;
let computerWonCount;
let playerWonCount;
let playerCard = "";
let computerCard = "";

start.onclick = function(){startGame()};
playerCardsWindow.onclick = function()
{
    document.getElementById('cards3').disabled = true;
    playerDrawCard();
    setTimeout(function(){computerDrawCard()}, 1000);
    setTimeout(function(){battleStart()}, 2000);
}

function startGame()
{
    deck = buildDeck();
    deck = shuffleDeck(deck);
    computerDeck = getCards(0, deck);
    playerDeck = getCards(1, deck);
    computerCardsCount = 26;
    playerCardsCount = 26;
    computerWonCount = 0;
    playerWonCount = 0;
    updateWindows("Game begins");
    document.getElementById('cards3').disabled = false;
}

//startGame methods

function buildDeck()
{
    let deck = [];
    let index = 0;
    const unique = [ "J", "Q", "K", "A"];
    const types = ["♠", "♥", "♦", "♣" ];
    for(let i = 0; i < 13; i++)
    {
        let value = "";
        if (i < 9)
        {
            value = i + 2;
        }
        else
        {
            value = unique[i - 9];
        }
        for (let f = 0; f < 4; f++)
        {
            let card = value + " " + types[f];                
            deck[index] = card;
            index++;
        }
    }
    return deck;
}

function shuffleDeck(deck)
{
    let newDeck = [];
    let index = -1;
    for(let i = 0; i < 52; i++)
    {
        while(true)
        {
            index = Math.floor(Math.random() * 52);
            if(!newDeck.includes(deck[index]))
            {
                newDeck[i] = deck[index];
                break;
            }
        }
    }
    return newDeck;
}

function getCards(num, deck)
{
    let newDeck = [];
    let index = 0;
    for(let i = num; i < 52; i = i + 2)
    {
        newDeck[index] = deck[i];
        index++;
    }
    return newDeck;
}

//Draw card methods

function playerDrawCard()
{
    playerCard = playerDeck.pop();;
    playerCardsCount--;
    updateWindows("Player draws " + playerCard);
}

function computerDrawCard()
{
    computerCard = computerDeck.pop();
    computerCardsCount--;
    updateWindows("Computer draws " + computerCard);
}

function battleStart()
{
    const playerCardValue = calcualteCardValue(playerCard);
    const computerCardValue = calcualteCardValue(computerCard);
    if(playerCardValue == computerCardValue)
    {
        updateWindows("War!");
        let tempCards1 = [];
        let tempCards2 = [];
        tempCards1.push(computerCard);
        tempCards2.push(playerCard);
        setTimeout(function(){warMethod(tempCards1, tempCards2)}, 1000)
        setTimeout(function(){finishMove()}, 2000);
    }
    if(playerCardValue > computerCardValue)
    {
        playerWonCount = playerWonCount + 2;
        playerNewDeck.push(playerCard);
        playerNewDeck.push(computerCard);
        updateWindows("Player wins the battle");
        setTimeout(function(){finishMove()}, 1000);
    }
    if(playerCardValue < computerCardValue )
    {
        computerWonCount = computerWonCount + 2;
        computerNewDeck.push(computerCard);
        computerNewDeck.push(playerCard);
        updateWindows("Computer wins the battle");
        setTimeout(function(){finishMove()}, 1000);
    }
}

function warMethod(tempCards1, tempCards2)
{
    if(playerCardsCount + playerWonCount < 4)
    {
        playerCardsCount = 0;
        playerWonCount = 0;
        playerCard = "";
        computerCard = "";
        updateWindows("Game over Computer wins");
    }
    else if(playerCardsCount < 4)
    {
        playerNewDeckToOld();
    }
    if(computerCardsCount + computerWonCount < 4)
    {
        computerCardsCount = 0;
        computerWonCount = 0;
        playerCard = "";
        computerCard = "";
        updateWindows("Game over Player wins");
    }
    else if(computerCardsCount < 4)
    {
        computerNewDeckToOld();
    }
    computerCardsCount = computerCardsCount - 4;
    playerCardsCount = playerCardsCount - 4;
    tempCards1.push(computerDeck.pop());
    tempCards1.push(computerDeck.pop());
    tempCards1.push(computerDeck.pop());
    tempCards1.push(computerDeck.pop());
    tempCards2.push(playerDeck.pop());
    tempCards2.push(playerDeck.pop());
    tempCards2.push(playerDeck.pop());
    tempCards2.push(playerDeck.pop());
    if(calcualteCardValue(tempCards1[tempCards1.length - 1]) > calcualteCardValue(tempCards2[tempCards2.length - 1]))
    {
        computerWonCount = computerWonCount + tempCards1.length + tempCards2.length;
        computerCard = tempCards1[tempCards1.length - 1];
        playerCard  = tempCards2[tempCards2.length - 1];
        while(tempCards1.length > 0)
        {
            computerNewDeck.push(tempCards1.pop());
        }
        while(tempCards2.length > 0)
        {
            computerNewDeck.push(tempCards2.pop())
        }
        updateWindows("Computer won the war");
    }
    else if(calcualteCardValue(tempCards1[tempCards1.length - 1]) < calcualteCardValue(tempCards2[tempCards2.length - 1]))
    {
        playerWonCount = playerWonCount + tempCards1.length + tempCards2.length;
        computerCard = tempCards1[tempCards1.length - 1];
        playerCard = tempCards2[tempCards2.length - 1];
        while(tempCards1.length > 0)
        {
            playerNewDeck.push(tempCards1.pop());
        }
        while(tempCards2.length > 0)
        {
            playerNewDeck.push(tempCards2.pop())
        }
        updateWindows("Player won the war");
    }
    else if(calcualteCardValue(tempCards1[tempCards1.length - 1]) == calcualteCardValue(tempCards2[tempCards2.length - 1]))
    {
        playerWonCount = playerWonCount + tempCards2.length;
        computerWonCount = computerWonCount + tempCards1.length;
        computerCard = tempCards1[tempCards1.length - 1];
        playerCard = tempCards2[tempCards2.length - 1];
        while(tempCards1.length > 0)
        {
            computerNewDeck.push(tempCards1.pop());
        }
        while(tempCards2.length > 0)
        {
            playerNewDeck.push(tempCards2.pop())
        }
        updateWindows("Draw, noone won");
    }
}

function finishMove()
{
    if(playerCardsCount == 0)
    {
        if(playerWonCount > 0)
        {
            playerNewDeckToOld();
        }
        else
        {
            updateWindows("Computer won, game over");
            return;
        }
    }
    if(computerCardsCount == 0)
    {
        if(computerWonCount > 0)
        {
            computerNewDeckToOld();
        }
        else
        {
            updateWindows("Player won, game over");
            return;
        }
    }
    playerCard = "";
    computerCard = "";
    updateWindows("Move finished");
    document.getElementById('cards3').disabled = false;
}

//Other methods

function playerNewDeckToOld()
{
    playerCardsCount = playerCardsCount + playerWonCount;
    playerWonCount = 0;
    while(playerNewDeck.length > 0)
    {
        playerDeck.push(playerNewDeck.pop());
    }
}

function computerNewDeckToOld()
{
    computerCardsCount = computerCardsCount + computerWonCount;
    computerWonCount = 0;
    while(computerNewDeck.length > 0)
    {
        computerDeck.push(computerNewDeck.pop());
    }
}

function calcualteCardValue(givenCard)
{
    card = givenCard.substring(0,1);
    if(card == "A")
    {
        return 14;
    }
    else if(card == "K")
    {
        return 13;
    }
    else if(card == "Q")
    {
        return 12;
    }
    else if(card == "J")
    {
        return 11;
    }
    else
    {
        if(givenCard.substring(0,2) == 10)
        {
            return 10;
        }
        else
        {
            return givenCard.substring(0,1);
        }
    }
}

function updateWindows(res)
{
    results.innerHTML = res;
    num1Window.innerHTML = num1Window.innerHTML.substring(0, 12) + computerCardsCount;
    num2Window.innerHTML = num2Window.innerHTML.substring(0, 11) + computerWonCount;
    num3Window.innerHTML = num3Window.innerHTML.substring(0, 12) + playerCardsCount;
    num4Window.innerHTML = num4Window.innerHTML.substring(0, 11) + playerWonCount;
    if(computerCardsCount > 0)
    {
        computerCardsWindow.innerHTML = pattern;
        switchColor('cards1', 'blue');
    }
    else
    {
        computerCardsWindow.innerHTML = ""
        switchColor('cards1', 'red');
    }
    if(computerWonCount > 0)
    {
        computerWonWindow.innerHTML = pattern;
        switchColor('cards2', 'blue');
    }
    else
    {
        computerWonWindow.innerHTML = ""
        switchColor('cards2', 'red');
    }
    if(playerCardsCount > 0)
    {
        playerCardsWindow.innerHTML = pattern;
        switchColor('cards3', 'blue');
    } 
    else
    {
        playerCardsWindow.innerHTML = "";
        switchColor('cards3', 'red');
    }
    if(playerWonCount > 0)
    {
        playerWonWindow.innerHTML = pattern;
        switchColor('cards4', 'blue');
    }
    else
    {
        playerWonWindow.innerHTML = "";
        switchColor('cards4', 'red');
    }
    if(computerCard == "")
    {
        battleCard2Window.innerHTML = "";
        switchColor('cards6', 'red');
    }
    else
    {
        battleCard2Window.innerHTML = computerCard;
        switchColor('cards6', 'blue');
    }
    if(playerCard == "")
    {
        battleCard1Window.innerHTML = "";
        switchColor('cards5', 'red');
    }
    else
    {
        battleCard1Window.innerHTML = playerCard;
        switchColor('cards5', 'blue');
    }
}

function switchColor(id, color)
{
    if(color == 'blue')
    {
        document.getElementById(id).style.background = 'rgba(0, 138, 245, 0.46)';
        document.getElementById(id).style.border = '1px solid rgba(0, 138, 245, 1)';
    }
    if(color == 'red')
    {
        document.getElementById(id).style.background = 'rgba(249, 14, 14, 0.39)';
        document.getElementById(id).style.border = '1px solid rgba(249, 14, 14, 1)';
    }
}