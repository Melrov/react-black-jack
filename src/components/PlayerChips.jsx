import React from "react";

function PlayerChips(props) {
  
  function chipClick(e) {
    props.setBet(parseInt(e.target.id));
  }

  return (
      <div className="bet-sec">
        <div className="chip-box">
          {props.chips / 5 >= 1 && (
            <img
              className="chip"
              src="/images/5-chip.png"
              id="5"
              onClick={chipClick}
            ></img>
          )}
          {props.chips / 10 >= 1 && (
            <img
              className="chip"
              src="/images/10-chip.png"
              id="10"
              onClick={chipClick}
            ></img>
          )}
          {props.chips / 50 >= 1 && (
            <img
              className="chip"
              src="/images/50-chip.png"
              id="50"
              onClick={chipClick}
            ></img>
          )}
          {props.chips / 100 >= 1 && (
            <img
              className="chip"
              src="/images/100-chip.png"
              id="100"
              onClick={chipClick}
            ></img>
          )}
          {props.chips / 500 >= 1 && (
            <img
              className="chip"
              src="/images/500-chip.png"
              id="500"
              onClick={chipClick}
            ></img>
          )}
        </div>

        <div className="player-chips">
          <span id="p1-chips">{props.chips}</span>
        </div>

        {
          <button className="lock-bet" id="p1-lockBet" onClick={props.lockBet}>
            Lock bet
          </button>
        }
      </div>
  );
}

export default PlayerChips;
