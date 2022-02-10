class Card {
    constructor(value, type) {
        this.value = value <= 10 ? value : 10;
        this.cardText = type > 2 ? String.fromCharCode((value + ( (type-3) * 13 )) + 64) : String.fromCharCode((value + ( (type-1) * 13 )) + 96)
        this.typeNum = type
        switch (type) {
            case 1:
                this.type = 'spade'
                break
            case 2:
                this.type = 'clubs'
                break
            case 3:
                this.type = 'diamonds'
                break
            case 4:
                this.type = 'hearts'
                break
            case 5:
                this.type = 'stopper'
                break
            default:
                this.type = 'number'
                break
        }
        switch (value) {
            case 1:
                this.name = 'Ace';
                break;
            case 11:
                this.name = 'Jack';
                break;
            case 12:
                this.name = 'Queen';
                break;
            case 13:
                this.name = 'King';
                break;
            default:
                break;
        }
    }
}

/**
 * 
 * @param {Integer} decks optional default is 1 -- how many decks of 52 to add to the cards pulled from
 * @param {boolean} cardStopper optional default is false -- only available when decks is 3 or greater
 */
export default class Deck {
    constructor(decks = 1, cardStopper = false) {
        this.decks = decks > 0 ? decks : 1;
        this.activePile = [];
        this.discardPile = [];
        this.cardPile = [];
        this.cardStopper = cardStopper && this.decks > 2 ? cardStopper : false
        this.cardStopperIndex = -1;

        for (let i = 1; i <= decks; i++) {
            for (let j = 1; j <= 4; j++) {
                for (let k = 1; k <= 13; k++) {
                    this.cardPile.push(new Card(k, j))
                }
            }
        }

        this.shuffle()

    }

    shuffle() {
        let currentIndex = this.cardPile.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [this.cardPile[currentIndex], this.cardPile[randomIndex]] = [
                this.cardPile[randomIndex], this.cardPile[currentIndex]
            ];
        }

        if (this.cardStopper) {
            this.cardStopperIndex = this.cardPile.length - Math.floor(Math.random() * Math.floor(this.cardPile.length * 0.2))
            this.cardPile.splice(this.cardStopperIndex, 0, new Card(0, 5));
        }

    }

    getCard(){
        if(this.cardPile.length === 0 || this.cardPile[0].type === 'stopper' ){
            this.cardPile.shift()
            this.cardPile.push(...this.discardPile)
            this.discardPile = [];
            this.shuffle()
        }
        return this.cardPile.shift()
    }

    discardHand(cards){
        //console.log('discard')
        //console.log(cards)
        cards.forEach(card => {
            //console.log(card)
            this.discardPile.push(card)
        })
    }


}