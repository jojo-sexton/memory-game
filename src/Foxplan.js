import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CARD_PAIRS = ['🐶', '🐱', '🐼', '🦊', '🐷', '🐵'];
const generateShuffledCards = () => [...CARD_PAIRS, ...CARD_PAIRS]
  .sort(() => Math.random() - 0.5)
  .map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }));

export default function Foxplan() {
  const [cards, setCards] = useState(generateShuffledCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isBoardLocked, setIsBoardLocked] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setIsBoardLocked(true);

      if (first.symbol === second.symbol) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.symbol === first.symbol ? { ...card, matched: true } : card
          )
        );
        setFlippedCards([]);
        setIsBoardLocked(false);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first.id || card.id === second.id ? { ...card, flipped: false } : card
            )
          );
          setFlippedCards([]);
          setIsBoardLocked(false);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedCards]);

  const handleCardClick = (card) => {
    if (card.flipped || card.matched || flippedCards.length === 2 || isBoardLocked) return;
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );
    setFlippedCards(prev => [...prev, { ...card, flipped: true }]);
  };

  const resetGame = () => {
    setCards(generateShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setIsBoardLocked(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-700">Memory Game</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`transition-transform duration-300 transform hover:scale-105 cursor-pointer h-24 flex items-center justify-center text-3xl border-4 rounded-2xl shadow-xl select-none ${card.flipped || card.matched ? 'bg-white text-black' : 'bg-purple-200 text-transparent'}`}
          >
            <CardContent>
              {card.flipped || card.matched ? card.symbol : '?'}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-lg font-medium">Moves: {moves}</p>
      <Button onClick={resetGame} className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md">Reset Game</Button>
    </div>
  );
}
