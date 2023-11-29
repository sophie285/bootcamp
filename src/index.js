import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
// import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { createStore, combineReducers } from 'redux';
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
} from 'react-redux-firebase';
import { initializeApp } from 'firebase/app';
// import { composeWithDevTools } from 'redux-devtools-extension';

const firebaseConfig = {
    apiKey: "AIzaSyAetyljyYei6ID0tAv7ycmZNFaRp3l9bRw",
    authDomain: "bootcamp-12f8e.firebaseapp.com",
    databaseURL: "https://bootcamp-12f8e-default-rtdb.firebaseio.com",
    projectId: "bootcamp-12f8e",
    storageBucket: "bootcamp-12f8e.appspot.com",
    messagingSenderId: "227008949802",
    appId: "1:227008949802:web:4bcc888068f94bc01e1d53"
  };

  const firebaseApp = initializeApp(firebaseConfig);

// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
  });
  
  // Create store with reducers and initial state
  const store = createStore(rootReducer);
  
  // react-redux-firebase config
  const rrfConfig = {
    userProfile: 'users',
  };
  
  const rrfProps = {
    firebase: firebaseApp,
    config: rrfConfig,
    dispatch: store.dispatch,
  };
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
