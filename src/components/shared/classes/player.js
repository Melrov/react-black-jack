class Person {
    constructor(div) {
        this.cardPile = [];
        this.cardTotal = 0;
        this.aceTotal = 0;
        this.bust = false
        this.div = div
    }

    evalCardValue() {
        this.cardTotal = 0;
        this.aceTotal = 0;
        this.cardPile.forEach(card => {
            this.cardTotal += card.value;
            if (card.name === 'Ace') {
                this.aceTotal += 10
            } else {
                this.aceTotal += card.value
            }
        })
        this.checkBust()
    }

    checkBust() {
        if (this.aceTotal > 21 && this.cardTotal > 21) {
            this.bust = true
            this.currentBet = 0
            return true
        }
        return false
    }

    /**
     * 
     * @param {Deck} deck takes in the current deck then takes the top card from the deck and adds it to the players hand
     */
    giveCard(deck) {
        this.cardPile.push(deck.getCard())
        this.evalCardValue()
    }

    /**
     * 
     * @param {Deck} deck takes in current deck then clears the players hand and adds those cards to the decks discard pile
     */
    discardHand(deck) {
        deck.discardHand(this.cardPile)
        this.cardPile = []
    }

}

/**
 * 
 * @param {htmlElement} div the html element container of the player
 * @param {number} chips optional: default 1000 -- how many chips the player will start with
 */
export class Player extends Person {
    constructor(div = 10, chips = 1000) {
        super(div)
        this.joined = false;
        this.chips = chips;
        this.currentBet = 0;
        this.betLock = false

        this.split = false
        this.splitAvailable = false

        this.splitPileL = []
        this.leftAceTotal = 0;
        this.leftCardTotal = 0;
        this.leftBust = false;
        this.betL = 0;

        this.splitPileR = []
        this.rightAceTotal = 0;
        this.rightCardTotal = 0;
        this.rightBust = false;
        this.betR = 0;
        this.isActiveLeft = true
    }

    giveCard(deck) {
        if (!this.split) {
            super.giveCard(deck)
            this.checkSplit()
        } else {
            if (this.isActiveLeft) {
                this.splitPileL.push(deck.getCard())
            }
        }
    }

    evalSplitValue() {
        if (this.isActiveLeft) {
            this.leftCardTotal = 0;
            this.leftAceTotal = 0;
            this.splitPileL.forEach(card => {
                this.leftCardTotal += card.value;
                if (card.name === 'Ace') {
                    this.leftAceTotal += 10
                } else {
                    this.leftAceTotal += card.value
                }
            })
            this.checkBust()
        } else {
            this.rightCardTotal = 0;
            this.rightAceTotal = 0;
            this.splitPileL.forEach(card => {
                this.rightCardTotal += card.value;
                if (card.name === 'Ace') {
                    this.rightAceTotal += 10
                } else {
                    this.rightAceTotal += card.value
                }
            })
            this.checkBust()
        }
    }

    checkSplit() {
        if (this.cardPile.length === 2 && this.chips - this.currentBet !== 0) {
            if (this.cardPile[0].value === this.cardPile[1].value) {
                this.splitAvailable = true
                return true
            }
            return false
        } else {
            this.splitAvailable = false
            return false
        }
    }

    checkBust() {
        if (!this.split) {
            return super.checkBust()
        } else {
            return this.splitCheckBust()
        }
    }
    splitCheckBust() {
        if (this.isActiveLeft) {
            if (this.splitPileL.aceTotal > 21 && this.splitPileL.cardTotal > 21) {
                this.leftBust = true
                this.betL = 0
                return true
            }
            return false
        } else {
            if (this.splitPileR.aceTotal > 21 && this.splitPileR.cardTotal > 21) {
                this.rightBust = true
                this.betR = 0
                return true
            }
            return false
        }
    }

    discardHand(deck) {
        if (!this.split) {
            super.discardHand(deck)
        } else {
            deck.discardHand(this.splitPileL)
            this.splitPileL = []
            deck.discardHand(this.splitPileR)
            this.splitPileR = []
        }
    }

    toggleBet() {
        this.betLock = !this.betLock
    }

    splitHand(deck) {
        if (this.splitAvailable) {
            this.split = true
            this.splitAvailable = false

            this.splitPileL.push(this.cardPile[0])
            this.splitPileR.push(this.cardPile[1])
            this.cardPile = []

            this.betL = this.currentBet;
            this.betR = this.currentBet;
            this.chips -= this.currentBet
            this.currentBet = 0;

            this.splitPileL.push(deck.getCard())
            this.splitPileR.push(deck.getCard())
        }
    }

    double(deck) {
        if (this.chips - this.currentBet >= 0) {
            this.chips -= this.currentBet
            this.currentBet *= 2
            this.giveCard(deck)
        }
    }

    surrender() {
        this.chips += this.currentBet / 2;
        this.currentBet = 0;
        this.bust = true;
    }

    addBet(bet){
        this.currentBet+=bet
        this.chips-= bet
    }

}


export class House extends Person {
    constructor(div) {
        super(div)
    }

    houseWin(players) {

        for(let i = 0; i < players.length; i++){
            if(players[i] !== undefined && !players[i].bust){
                if(players[i].cardTotal >= this.cardTotal){
                    return false
                }
                if(players[i].aceTotal <= 21 && players[i].aceTotal > this.cardTotal){
                    return false
                }
            }
        }
        if(this.cardTotal <= 21 || this.aceTotal <= 21){
            return true
        }
        return false
    }

    showAllHouseCards(houseDiv, houseScoreDiv){
        houseScoreDiv.innerText = this.aceTotal === this.cardTotal ? `${this.cardTotal}` : this.aceTotal > 21 ? `${this.cardTotal}` : `${this.cardTotal} / ${this.aceTotal}`
        houseDiv.innerText = ""
        this.cardPile.forEach(card => {
            houseDiv.innerText += card.cardText
        })
    }

    getHigherNum(aceTotal, cardTotal){
        if(aceTotal > 21){
            return cardTotal
        }
        return aceTotal
    }

    play(deck, players, houseDiv, houseScoreDiv, playerScoreDiv) {
        console.log(players)
        console.log(this.checkBust(), this.houseWin(players))
        this.showAllHouseCards(houseDiv, houseScoreDiv)
        let running = true
        while (running) {
            if (!this.checkBust() && !this.houseWin(players)) {
                if (this.cardTotal < 17 || this.aceTotal < 17) {
                    this.giveCard(deck)
                    this.showAllHouseCards(houseDiv, houseScoreDiv)
                    console.log(this.cardPile)
                } else {
                    running = false
                }
            } else {
                running = false
            }
        }
        console.log(this.houseWin(players))
        console.log(this.cardTotal)
        console.log(this.cardPile)

        this.discardHand(deck)

        if (this.houseWin(players)) {
            houseScoreDiv.style.backgroundColor = 'green'
            players.forEach(player => {
                if (player !== undefined) {
                    player.currentBet = 0;
                    player.bust = false
                    player.discardHand(deck)
                }
            })
            playerScoreDiv.forEach(score => {
                score.style.backgroundColor = 'red'
            })
        }
        else if(!this.checkBust()){
            houseScoreDiv.style.backgroundColor = 'red'
            for(let i = 0; i < players.length; i++){
                if(players[i] !== undefined ){
                    if(!players[i].bust){
                        if(this.getHigherNum(this.aceTotal, this.cardTotal) < this.getHigherNum(players[i].aceTotal, players[i].cardTotal)){
                            players[i].chips += Math.floor(players[i].currentBet * 1.5)
                            players[i].currentBet = 0;
                            playerScoreDiv[i].style.backgroundColor = 'green'
                            players[i].discardHand(deck)
                        }
                        else if(this.getHigherNum(this.aceTotal, this.cardTotal) === this.getHigherNum(players[i].aceTotal, players[i].cardTotal)){
                            players[i].chips += players[i].currentBet
                            players[i].currentBet = 0
                            playerScoreDiv[i].style.backgroundColor = 'blue'
                            players[i].discardHand(deck)
                        }
                        else if(this.getHigherNum(this.aceTotal, this.cardTotal) > this.getHigherNum(players[i].aceTotal, players[i].cardTotal)){
                            players[i].currentBet = 0;
                            playerScoreDiv[i].style.backgroundColor = 'red'
                            players[i].discardHand(deck)
                        }
                    }
                    else{
                        players[i].currentBet = 0;
                        playerScoreDiv[i].style.backgroundColor = 'red'
                        players[i].bust = false
                        players[i].discardHand(deck)
                    }
                }
            }
           
        }
        else{
            houseScoreDiv.style.backgroundColor = 'red'
            for(let i = 0; i < players.length; i++){
                if(players[i] !== undefined){
                    if(!players[i].bust){
                        players[i].chips += Math.floor(players[i].currentBet * 1.5)
                        playerScoreDiv[i].style.backgroundColor = 'green'
                        players[i].currentBet = 0;
                        players[i].discardHand(deck)
                    }
                    else{
                        players[i].chips += players[i].currentBet
                        playerScoreDiv[i].style.backgroundColor = 'red'
                        players[i].currentBet = 0
                        players[i].bust = false
                        players[i].discardHand(deck)
                    }
                }
            }
        }
        console.log(players)
        console.log(deck.discardPile)

    }

}