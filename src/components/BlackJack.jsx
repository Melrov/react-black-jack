import React, { useEffect, useState } from "react";
import { Player, House } from "./shared/classes/player";
import Deck from "./shared/classes/deck";
import PlayerDisplay from "./PlayerDisplay";
import HouseDisplay from "./HouseDisplay";
//import image from "../../public/images/TableText.png"
import "./style.css";

function BlackJack() {
  const deck = new Deck();
  const [players, setPlayers] = useState([
    new Player(),
    new Player(),
    new Player(),
    new Player(),
    new Player(),
  ]);

  let activeIndex = -1;

  function setPlayer(player, i) {
    setPlayers((curr) => [...curr.slice(0, i), player, ...curr.slice(i + 1)]);
    console.log(players);
  }

  return (
    <div id="board">
    <HouseDisplay />
    <img class="main-img" src="/images/TableText.png" />
    <div id="player-sec">
      {players.map((player, idx) => (
        <PlayerDisplay
          setPlayer={setPlayer}
          player={player}
          idx={idx}
          key={idx}
          active={ idx === activeIndex ? "true" : "false"}
        />
      ))}
    </div>
    </div>
  );
}

export default BlackJack;
