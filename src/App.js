import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';
import Homepage from './Homepage';

import {Routes, Route} from 'react-router-dom';

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path="/editor" element={<CardEditor />} />
      <Route exact path="/viewer/:deckId" element={<CardViewer />} />
    </Routes>
  );
}


export default App;

