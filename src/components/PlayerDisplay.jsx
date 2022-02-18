import React, { useState } from "react";
import PlayerChips from "./PlayerChips";
import styled from "styled-components";

const Arrow = styled.i`
    border: solid black;
    border-width: 0px 7px 7px 0;
    padding: 11px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    position: absolute;
    top: -225px;
    transition: all 1s ease-in-out;
`
const Player = styled.div`
    height: 120px;
    width: 80px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    border: 3px solid #fee003;
    flex-direction: column;
    position: relative;
    `
  const Hand = styled.div`
    font-family: myFirstFont;
    font-size: 86px;
    position: relative;
    top: -23vh;
  `

function PlayerDisplay(props) {
  let { player, setPlayer, running } = props;

  function lockBet() {
    player.toggleBet();
    setPlayer(player, props.idx);
    props.buttonClick();
  }

  function setBet(bet) {
    player.addBet(bet);
    setPlayer(player, props.idx);
  }

  function join() {
    player.joined = true;
    setPlayer(player, props.idx);
    props.buttonClick();
  }

  let bet = player.currentBet;
  let betZone = [];

  for (let i = Math.floor(bet / 500); i > 0; i--) {
    bet -= 500;
    betZone.push(
      <img
        key={i + "500"}
        className="chip-img-bet"
        src="/images/500-chip.png"
      />
    );
  }
  for (let i = Math.floor(bet / 100); i > 0; i--) {
    bet -= 100;
    betZone.push(
      <img
        key={i + "100"}
        className="chip-img-bet"
        src="/images/100-chip.png"
      />
    );
  }
  for (let i = Math.floor(bet / 50); i > 0; i--) {
    bet -= 50;
    betZone.push(
      <img key={i + "50"} className="chip-img-bet" src="/images/50-chip.png" />
    );
  }
  for (let i = Math.floor(bet / 10); i > 0; i--) {
    bet -= 10;
    betZone.push(
      <img key={i + "10"} className="chip-img-bet" src="/images/10-chip.png" />
    );
  }
  for (let i = Math.floor(bet / 5); i > 0; i--) {
    bet -= 5;
    betZone.push(
      <img key={i + "5"} className="chip-img-bet" src="/images/5-chip.png" />
    );
  }

  //console.log(betZone);
  //console.log("hello ");
  // id="[a-z0-9-]+"
  return (
    <Player /* className="player" */ >
      {props.active && <Arrow  /* className="arrow" */ ></Arrow>}
      {!player.joined && !running && (
        <button className="join-btn" onClick={join}>
          +
        </button>
      )}
      {player.split && <div id="p1-split-left"></div>}
      {!player.split && (
        <Hand /* className="player-hand" id="p1-hand" */ >
          {player.cardPile.map((card, idx) => (
            <span
              key={props.idx + idx}
              style={{
                position: idx !== 0 ? "absolute" : "",
                top: idx * 0 + "px",
                left: idx * 23 + "px",
                transform: "rotate(" + idx * 6 + "deg)",
                color: card.typeNum > 2 ? "red" : "black",
                zIndex: 200,
                backgroundColor: "white",
                border: "2px solid black",
                paddingTop: idx === 0 ? "8px" : "5px",
                borderRadius: "6px",
              }}
            >
              {card.cardText}
            </span>
          ))}
        </Hand>
      )}
      {player.cardPile.length >= 1 && (
        <span
          className="player-score"
          id="p1-score"
          style={{
            backgroundColor:
              player.bust || player.win === false
                ? "red"
                : player.pushW === true
                  ? "blue"
                  : player.win === true
                    ? "green"
                    : "",
          }}
        >
          {player.cardTotal +
            " " +
            (player.aceTotal <= 21 && player.aceTotal !== player.cardTotal
              ? "/ " + player.aceTotal
              : "")}
        </span>
      )}
      {player.split && <div id="p1-split-right"></div>}
      {player.joined && !player.betLock && (
        <PlayerChips chips={player.chips} lockBet={lockBet} setBet={setBet} />
      )}
      <div className="chip-drop-zone">{betZone}</div>
    </Player>
  );
}

export default PlayerDisplay;
