import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { ref, onValue, getDatabase } from 'firebase/database';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homepage: null,
      error: null
    };
  }

  componentDidMount() {
    const db = getDatabase();
    const homepageRef = ref(db, 'homepage'); // Adjust the path as needed

    onValue(homepageRef, (snapshot) => {
      if (snapshot.exists()) {
        this.setState({ homepage: snapshot.val() });
      } else {
        this.setState({ error: 'No data available' });
      }
    }, (error) => {
      console.error('Error fetching homepage data:', error);
      this.setState({ error });
    });
  }

  render() {
    const { homepage, error } = this.state;

    if (!homepage && !error) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error loading data: {error}</div>;
    }

    const decks = homepage ? Object.keys(homepage).map(deckId => {
      const deck = homepage[deckId];
      return (
        <div key={deckId}>
          <Link to={`/viewer/${deckId}`}>{deck.name}</Link>
        </div>
      );
    }) : <div>No decks available</div>;

    return (
      <div>
        <h2>Homepage</h2>
        <Link to="/editor">Create a new flashcards deck!</Link>
        <h3>Flashcards</h3>
        {decks}
      </div>
    );
  }
}

// PropTypes for the component
Homepage.propTypes = {
  firebase: PropTypes.object.isRequired
};

export default compose(firebaseConnect(), connect())(Homepage);
