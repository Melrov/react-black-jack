import React, { useState } from "react";
import { Player, House } from "./shared/classes/player";
import Deck from "./shared/classes/deck";
import PlayerDisplay from "./PlayerDisplay";
import HouseDisplay from "./HouseDisplay";
//import image from "../../public/images/TableText.png"
import "./style.css";
import ButtonSec from "./ButtonSec";

function BlackJack() {
  const [running, setRunning] = useState(false);
  const [deck, setDeck] = useState(new Deck());
  const [house, setHouse] = useState(new House());
  const [players, setPlayers] = useState([
    new Player(),
    new Player(),
    new Player(),
    new Player(),
    new Player(),
  ]);

  const [activeIndex, setActiveIndex] = useState(-1);

  function setPlayer(player, i) {
    setPlayers((curr) => [...curr.slice(0, i), player, ...curr.slice(i + 1)]);
  }

  let joined = 0;
  let locked = 0;

  function buttonClick() {
    players.forEach((player) => {
      if (player.betLock) {
        locked++;
      }
      if (player.joined) {
        joined++;
      }
    });

    if (joined !== 0 && joined === locked) {
      console.log("start game");
      setRunning(true);
      runGame();
    }
  }

  function runGame() {
    players.forEach((player, idx) => {
      player.reset(deck);
      setPlayer(player, idx);
    });
    house.reset(deck);
    setHouse(house);
    dealCards();
    for (let i = players.length - 1; i >= 0; i--) {
      if (players[i].joined) {
        setActiveIndex(i);
        i = -1;
      }
    }
    console.log(players);
  }

  function houseMove() {
    house.play(deck, players, setDeck, setPlayer, setHouse);
    players.forEach((player) => {
      player.betLock = false;
    });
  }

  function nextPlayer() {
    console.log("called");
    for (let i = activeIndex - 1; i >= -1; i--) {
      if (players[i] !== undefined && players[i].joined) {
        setActiveIndex(i);
        i = -2;
      }
      if (i === -1) {
        setActiveIndex(i);
        console.log("house move");
        houseMove();
        setRunning(false)
      }
    }
  }

  function dealCards() {
    for (let i = 0; i < 2; i++) {
      house.giveCard(deck);
      setHouse(house);

      for (let j = players.length - 1; j >= 0; j--) {
        if (players[j].joined) {
          players[j].giveCard(deck);
          setPlayer(players[j], j);
        }
      }
    }
  }

  return (
    <div id="board">
      <HouseDisplay house={house} />
      <img className="main-img" src="/images/TableText.png" />
      <div id="player-sec">
        {players.map((player, idx) => (
          <PlayerDisplay
            setPlayer={setPlayer}
            player={player}
            idx={idx}
            key={idx}
            running={running}
            buttonClick={buttonClick}
            active={idx === activeIndex ? true : false}
          />
        ))}
      </div>
      <ButtonSec
        player={players[activeIndex]}
        setPlayer={setPlayer}
        deck={deck}
        idx={activeIndex}
        nextPlayer={nextPlayer}
      />
    </div>
  );
}

export default BlackJack;
