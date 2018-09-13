import React, { Component } from "react";

class Player extends React.Component {
  renderCards = () => {
    let { cards, pairs, player } = this.props;
    let pairArray = [];

    return cards.map(item => {
      let isPair1 = "";
      let isPair2 = "";

      if (
        pairs.has(item.value.value) &&
        pairs.get(item.value.value).count >= 0
      ) {
        let cardVal = pairs.get(item.value.value).cardVal;
        let points = pairs.get(item.value.value).points;
        let count = pairs.get(item.value.value).count - 1;

        pairs.set(item.value.value, { cardVal, points, count });

        pairArray.push(item.value.value);
        pairArray.map(item => {
          isPair1 = "";
          isPair2 = "";
          pairArray.indexOf(item) === 0
            ? (isPair1 = "card pair0")
            : (isPair2 = "card pair1");
        });
      } else {
        isPair1 = "card";
      }
      return (
        <img
          src={item.value.cardImg}
          className={isPair2 ? isPair2 : isPair1}
          key={item.value.cardImg}
        />
      );
    });
  };

  render() {
    const { winner, player } = this.props;
    return (
      <section className={`hand ${winner}`}>
        <h1>{player}</h1>
        {this.renderCards()}
      </section>
    );
  }
}

export default Player;
