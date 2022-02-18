import React from "react";

function HouseDisplay(props) {
  let { house } = props;
  return (
    <div className="house-sec" id="house-sec">
      <div id="house-cards">
        {house.cardPile.map(
          (card, idx) =>
            (!(idx === 1) || house.showAll) && <span style={{
              color: card.typeNum > 2 ? "red" : "black",
              backgroundColor: "white",
                border: "2px solid black",
                paddingTop: "8px",
                borderRadius: "6px",
                margin: "6px"
            }}>{card.cardText}</span>
        )}
      </div>
      {house.cardTotal !== 0 && (
        <span
          style={{
            backgroundColor:
              house.win === true
                ? "green"
                : house.pushW === true
                  ? "blue"
                  : house.win === false || house.bust === true
                    ? "red"
                    : "",
          }}
          className="house-score"
          id="house-score"
        >
          {house.showTotal
            ? house.cardTotal +
            " " +
            (house.aceTotal <= 21 && house.aceTotal !== house.cardTotal
              ? "/ " + house.aceTotal
              : "")
            : house.cardPile[0].name === 'Ace' ? '1 / 11' : house.cardPile[0].value}
        </span>
      )}
    </div>
  );
}

export default HouseDisplay;
