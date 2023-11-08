import React from 'react';

import {Link} from 'react-router-dom';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div>
                <h2>Homepage</h2>
                <Link to="/editor">Go to card editor</Link>
                <br></br>
                <Link to="/viewer">Go to card viewer</Link>
            </div>
        )
    }
}

export default Homepage;