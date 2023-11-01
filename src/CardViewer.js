import React from 'react';
import './CardViewer.css';

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
        const { currentCardIndex } = this.state;
        console.log(this.props.cards);
        const flashcard = this.props.cards[currentCardIndex][this.state.isFront ? 'front' : 'back'];
        
        return (
            <div>
                <h2>Card Viewer</h2>
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
                <button onClick={this.props.switchMode}>Go to card editor</button>
            </div>
        )
    }
}

export default CardViewer;