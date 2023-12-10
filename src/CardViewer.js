import React, { useState, useEffect } from 'react';
import './CardViewer.css';
import { Link, useParams } from 'react-router-dom';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { ref, onValue, getDatabase } from 'firebase/database';

function CardViewer(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayFront, setDisplayFront] = useState(true);
  const [cards, setCards] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const { deckId } = useParams();

  useEffect(() => {
    const db = getDatabase();
    const deckRef = ref(db, `/flashcards/${deckId}`);

    onValue(
      deckRef,
      (snapshot) => {
        if (snapshot.exists()) {
          console.log("Firebase snapshot:", snapshot.val());
          const data = snapshot.val();
          setCards(data.cards || []);
          setName(data.name || '');
        } else {
          setError('Deck not found');
        }
      },
      (error) => {
        console.error(error);
        setError(error.message);
      }
    );
  }, [deckId]);

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDisplayFront(true);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDisplayFront(true);
    }
  };

  const handleCardClick = () => setDisplayFront(!displayFront);

  if (!isLoaded(cards)) {
    return <div>Loading...</div>;
  }

  if (isEmpty(cards)) {
    return <div>Page not found!</div>;
  }

  const flashcard = cards[currentIndex][displayFront ? 'front' : 'back'];

  return (
    <div class="flashcard-container">
      Card {currentIndex + 1} out of {cards.length}.
      <div class="flashcard" onClick={handleCardClick}>
        {flashcard}
      </div>
      <br />
      <button
        disabled={currentIndex === 0}
        onClick={handlePrevCard}
      >
        Prev card
      </button>
      <button
        disabled={currentIndex === cards.length - 1}
        onClick={handleNextCard}
      >
        Next card
      </button>
      <hr />
      <Link to="/">Home</Link>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  const deck = state.firebase.data[props.deckId];
  const name = deck && deck.name;
  const cards = deck && deck.cards;
  return { cards: cards, name: name };
};

export default connect(mapStateToProps)(CardViewer);
