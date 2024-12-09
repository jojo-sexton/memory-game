import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./MemoryGame.css";


const cardImages = [
  { src: "/img1.png", matched: false },
  { src: "/img2.png", matched: false },
  { src: "/img3.png", matched: false },
  { src: "/img4.png", matched: false },
  { src: "/img5.png", matched: false },
  { src: "/img6.png", matched: false },
];
function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Shuffle cards and reset the game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
    setFirstChoice(null);
    setSecondChoice(null);
  };

  // Automatically shuffle cards when the game starts
  useEffect(() => {
    shuffleCards();
  }, []);

  // Handle choice selection
  const handleChoice = (card) => {
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  // Check for a match
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
        resetChoices();
      } else {
        setTimeout(() => resetChoices(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // Reset choices and increment turns
  const resetChoices = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="memory-game">
      <button onClick={shuffleCards}>New Game</button>
      <p>Turns: {turns}</p>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === firstChoice || card === secondChoice || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;