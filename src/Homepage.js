import React from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import {connect} from 'react-redux';
import { compose } from 'redux';

class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            decks: {}, // This will hold the deck data retrieved from the database
        };
    }

    // componentDidMount() {
    //     // Fetch the deck data from the /homepage path in the database
    //     const db = getDatabase();
    //     const homepageRef = ref(db, 'homepage');

    //     onValue(homepageRef, (snapshot) => {
    //         // Update the state with the retrieved deck data
    //         this.setState({ decks: snapshot.val() || {} });
    //     });
    // }

    render() {
        
        if (!isLoaded(this.props.deck)) {
            return <div>Loading...</div>
        } 
        else {
            const { decks } = this.props;
            console.log(this.props);
            return (
                <div>
                    <h2>Homepage</h2>
                    <Link to="/editor">Create a new deck</Link>
                    <br></br>
                    <h3>Your Decks:</h3>
                    <ul>
                        {Object.keys(decks).map((deckId) => (
                            <li key={deckId}>
                                <Link to={`/viewer/${deckId}`} key={deckId}>
                                    {decks[deckId].name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
        
    }
}

const mapStateToProps = (state) => {
    const decks = state.firebase.data.homepage;
    return {decks: decks};
}


export default compose (
    firebaseConnect([{ path: '/homepage', storeAs: 'homepage' }]),
    connect(mapStateToProps),
)(Homepage);