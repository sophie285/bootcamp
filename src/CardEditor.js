import React from 'react';
import './CardEditor.css';

import {Link, useNavigate} from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import {compose} from 'redux';
import { getDatabase, ref, push, set } from 'firebase/database';
export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const navigate = useNavigate();
        return <Component navigate={navigate} {...props} />;
    };
    return Wrapper;
}

class CardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            cards: [
                { front: 'front1', back: 'back1' },
                { front: 'front2', back: 'back2' },
            ],
            front: '', 
            back: '',
            name: '',
        };
    }

    addCard = () => {
        if (this.state.front.trim() !== '' && this.state.back.trim() !== '') {
            
            const newCard = { front: this.state.front, back: this.state.back };
            const cards = this.state.cards.slice().concat(newCard);
            
            this.setState({ cards, front: '', back: '' });
        }
    }

    deleteCard = index => {
        const cards = this.state.cards.slice();
        cards.splice(index, 1);
        this.setState({ cards });
    }

    handleChange = event => this.setState({ [event.target.name]: event.target.value });

    // createDeck = () => {
    //     const deckId = this.props.firebase.push('/flashcards').key;
    //     const newDeck = { cards: this.state.cards, name: this.state.name };
    //     const onComplete = () => {
    //         console.log('database updated!');
    //         this.props.navigate(`/viewer/${deckId}`);
    //     };
    //     this.props.firebase.update(`/flashcards/${deckId}`, newDeck, onComplete);
    // }

    createDeck = async (deckName, cards) => {
        const db = getDatabase();
        const decksRef = ref(db, 'flashcards');
      
        // Generate a sanitized key for the new deck
        const sanitizedDeckName = deckName.replace(/[.#$/[\]]/g, '_');
        const newDeckKey = push(decksRef).key;
      
        // Use the sanitized key to set the data for the new deck
        await set(ref(db, `flashcards/${newDeckKey}`), {
            name: sanitizedDeckName,
            cards: [],
        });

        // Add cards to the new deck
        const cardsRef = ref(db, `flashcards/${newDeckKey}/cards`);
        for (const card of cards) {
            const newCardKey = push(cardsRef).key;
            await set(ref(db, `flashcards/${newDeckKey}/cards/${newCardKey}`), card);
        }
      
        return newDeckKey; // Return the key if needed
      };

    render() {
        const cards = this.state.cards.map((card, index) => {
            return (
                <tr key = {index}>
                    <td>{card.front}</td>
                    <td>{card.back}</td>
                    <td>
                        <button onClick={()=>this.deleteCard(index)}>Delete card</button>
                    </td>
                </tr>
            )
        })

        return (
            <div>
                <h2>Card Editor</h2>
                <div>
                    Deck name: {' '}
                    <input 
                        name = "name"
                        onChange = {this.handleChange} 
                        placeholder="Name of deck" 
                        value={this.state.name} 
                    />
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>{cards}</tbody>
                </table>
                <br/>
                <input 
                name="front"
                    onChange={this.handleChange} 
                    placeholder="Front of card" 
                    value={this.state.front}/>
                <input 
                name="back"
                    onChange={this.handleChange} 
                    placeholder="Back of card" 
                    value={this.state.back}/>
                <button onClick={this.addCard}>Add card</button>
                <hr />
                <div>
                    <button
                        disabled = {!this.state.name.trim() || this.state.cards.length === 0}
                        onClick={() => this.createDeck(this.state.name, this.state.cards)}
                    >
                        Create deck
                    </button>
                </div>
                <br />
                <Link to="/">Home</Link>
            </div>
        );
    }
}

export default compose(firebaseConnect(), withRouter)(CardEditor);