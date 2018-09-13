import React, { Component } from "react";
import ReactDOM from "react-dom";
import Player from "./Components/Player";
import "./styles.css";

class Table extends Component {
  state = {
    player1: [],
    player2: [],
    player1Pairs: [],
    player2Pairs: [],
    winner: "",
    player1Wins: "",
    player2Wins: ""
  };

  dealCards = () => {
    const cards = this.generateDeck();
    const hand = new Map();
    const player1 = [];
    const player2 = [];

    let count = 1;

    // build out our hand of 10 cards
    while (hand.size !== 10) {
      //generate random number and use it as the index for our list of cards
      let rand = Math.floor(Math.random() * (52 - 0) + 0);
      let key = cards.list[rand];
      //create our hand and set a unique value to avoid any duplicates
      hand.set(key, cards.deck.get(key));
    }
    // iterate through hand and deal the cards (even to player1 / odd to player2)
    hand.forEach((value, key) => {
      count % 2 === 0
        ? player1.push({ key, value })
        : player2.push({ key, value });
      count++;
    });

    console.log("Player 1's Hand", player1);
    console.log("Player 2's Hand", player2);

    let player1Pairs = this.findPairs(player1);
    let player2Pairs = this.findPairs(player2);
    let winner = this.determineWinner(player1Pairs, player2Pairs);
    // set our state with our players cards
    this.setState({
      player1,
      player2,
      player1Pairs,
      player2Pairs,
      winner
    });
  };

  generateDeck = () => {
    const cardBaseURL = "http://h3h.net/images/cards/{suit}_{card}.svg";
    const suits = ["spade", "heart", "diamond", "club"];
    const cards = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A"
    ];

    const deck = new Map();
    const list = [];

    // build our deck by generating 52 unique cards with a card image and value
    suits.forEach(suit => {
      cards.forEach(card => {
        let cardPoints = "";

        switch (card) {
          case "A":
            cardPoints = "14";
            break;
          case "K":
            cardPoints = "13";
            break;
          case "Q":
            cardPoints = "12";
            break;
          case "J":
            cardPoints = "11";
            break;
          default:
            cardPoints = card;
        }

        let set = {
          value: card,
          points: cardPoints,
          cardImg: `http://h3h.net/images/cards/${suit}_${card}.svg`
        };
        // set our unique playing card, add an object with additional info
        deck.set(`${suit + card}`, set);
        // set our list that we use for shuffling
        list.push(`${suit + card}`);
      });
    });

    return { deck, list };
  };

  determineWinner = (player1, player2) => {
    let winner = "";
    let player1Points = [];
    let p1Pair = [];
    let player2Points = [];
    let p2Pair = [];

    for (let [key, value] of player1) {
      player1Points.push(value.points);
      p1Pair.push(value.cardVal);
    }
    for (let [key, value] of player2) {
      player2Points.push(value.points);
      p2Pair.push(value.cardVal);
    }

    if (p1Pair.length === 0 && p2Pair.length === 0)
      return "No pairs, try again";

    switch (true) {
      case p1Pair.length > p2Pair.length:
        winner = "player1";
        break;
      case p1Pair.length < p2Pair.length:
        winner = "player2";
        break;
      case p1Pair.length === p2Pair.length:
        let points1Number = Number(player1Points.toString());
        let points2Number = Number(player2Points.toString());
        if (player1Points.length === 2 && player2Points.length === 2) {
          let maxP1 = Math.max(...player1Points);
          let maxP2 = Math.max(...player2Points);
          maxP1 > maxP2 ? (winner = "player1") : (winner = "player2");
          return;
        }
        if (points1Number > points2Number) {
          winner = "player1";
        } else if (points2Number > points1Number) {
          winner = "player2";
        } else {
          return "It's a tie!!";
        }
        break;
      default:
        return "It's a tie!!";
    }

    return winner;
  };

  findPairs = player => {
    const cards = new Map();
    let pairs = new Map();
    player.map((card, index) => {
      let cardVal = card.value.value;
      let points = card.value.points;

      if (cards.has(cardVal)) {
        cards.set(cardVal, cards.get(cardVal) + 1);
        if (cards.get(cardVal) === 2) {
          let cardInfo = { cardVal, points, count: 1 };
          pairs.set(cardVal, cardInfo);
        }
      } else {
        cards.set(cardVal, 1);
      }
    });
    return pairs;
  };

  render() {
    const { player1, player2, player1Pairs, player2Pairs, winner } = this.state;
    return (
      <div className="Table">
        <Player
          cardsDealt
          player={"Player 1"}
          cards={player1}
          pairs={player1Pairs}
          winner={winner === "player1" ? "winning" : ""}
        />
        <Player
          cardsDealt
          player={"player 2"}
          cards={player2}
          pairs={player2Pairs}
          winner={winner === "player2" ? "winning" : ""}
        />
        <h3>
          {this.state.winner !== "player1" || this.state.winner !== "player2"
            ? this.state.winner
            : null}
        </h3>

        <section className="buttons">
          <button onClick={this.dealCards}>Deal</button>
        </section>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Table />, rootElement);
