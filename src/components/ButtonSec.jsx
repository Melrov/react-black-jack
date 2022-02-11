import React from "react";

function ButtonSec(props) {
  let { player, setPlayer, deck, nextPlayer } = props;

  function updatePlayer() {
    setPlayer(player, props.idx);
  }

  function hit() {
    player.giveCard(deck);
    updatePlayer();
    if (player.cardTotal >= 21 && player.aceTotal >= 21) {
      console.log("over");
      nextPlayer();
      console.log("should of called");
    }
  }

  function surrender() {
    player.surrender();
    updatePlayer();
    nextPlayer();
  }

  function double() {
    player.double();
    updatePlayer();
    if (player.cardTotal >= 21 && player.aceTotal >= 21) {
      console.log("over");
      nextPlayer();
    }
  }

  function stand() {
    updatePlayer();
    nextPlayer();
  }

  return (
    <div className="button-sec">
      {!(props.idx < 0) && player.cardPile.length === 2 && (
        <div>
          <button id="double" onClick={double}>
            Double
          </button>
          <button id="surrender" onClick={surrender}>
            SURRENDER
          </button>
        </div>
      )}

      {!(props.idx < 0) && (
        <div>
          <button id="hit" onClick={hit}>
            HIT
          </button>
          {player.checkSplit() && <button id="split">SPLIT</button>}
          <button id="stand" onClick={stand}>
            STAND
          </button>
        </div>
      )}
    </div>
  );
}

export default ButtonSec;
