import React from 'react';
import './CardViewer.css';

// import 'firebase/compat/auth'
// import 'firebase/compat/database'

import {Link, useNavigate, useParams} from 'react-router-dom';
import {firebaseConnect, isLoaded, isEmpty} from 'react-redux-firebase';
import {connect} from 'react-redux';
import {compose} from 'redux';
export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const { deckId } = useParams();
        const history = useNavigate();
        return <Component deckId={deckId} history={history} {...props} />;
    };
    return Wrapper;
}

class CardViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentCardIndex: 0, isFront: true };
    }

    handleNextCard = () => {
        const { currentCardIndex } = this.state;
    
        if (currentCardIndex < this.props.cards.length - 1) {
          this.setState({ currentCardIndex: currentCardIndex + 1, isFront: true });
        }
    };
    
    handlePrevCard = () => {
        const { currentCardIndex } = this.state;
    
        if (currentCardIndex > 0) {
          this.setState({ currentCardIndex: currentCardIndex - 1, isFront: true });
        }
    };

    handleCardClick = () => {
        const { currentCardIndex } = this.state;
        const flashcard = this.props.cards[currentCardIndex];
    
        if (flashcard) {
            this.setState((prevState) => ({ isFront: !prevState.isFront }));
        }
    };

    render() {
        if (!isLoaded(this.props.cards)) {
            return <div>Loading...</div>;
        }

        if (isEmpty(this.props.cards)) {
            return <div>Page not found!</div>;
        }

        const { currentCardIndex } = this.state;
        console.log(this.props.cards);
        const flashcard = this.props.cards[currentCardIndex][this.state.isFront ? 'front' : 'back'];

        return (
            <div>
                <h2>{this.props.name}</h2>
                <div className="flashcard-container">
                    <div className="flashcard" onClick={this.handleCardClick}>
                        {flashcard}
                    </div>
                </div> 
                <div className="progress-bar">
                    Card {currentCardIndex + 1}/{this.props.cards.length}
                </div>
                <div className="button-container">
                    <button onClick={this.handlePrevCard} disabled={currentCardIndex === 0}>
                        Previous Card
                    </button>
                    <button onClick={this.handleNextCard} disabled={currentCardIndex === this.props.cards.length - 1}>
                        Next Card
                    </button>
                </div>
                <hr />
                <Link to="/">Home</Link>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    const deckId = props.deckId;
    const deck = state.firebase.data[deckId];
    const name = deck && deck.name;
    const cards = deck && deck.cards;
    return { cards: cards, name: name };
};

export default compose(
    withRouter,
    firebaseConnect(props => {
        const deckId = props.deckId;
        return [{ path: `/flashcards/${deckId}`, storeAs: 'deckId' }];
    }),
    connect(mapStateToProps),
)(CardViewer);