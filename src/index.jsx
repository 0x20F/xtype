import React from 'react'
import ReactDOM from 'react-dom'

import App from './app/App'
import 'styles/app.scss'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMoekin46l_sVFUocqhsvHWJp_uP51np4",
    authDomain: "xtype-946f8.firebaseapp.com",
    projectId: "xtype-946f8",
    storageBucket: "xtype-946f8.appspot.com",
    messagingSenderId: "766304622508",
    appId: "1:766304622508:web:9dbc532aec1e0c4ce48c09",
    measurementId: "G-77JBWXW9TL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


ReactDOM.render(<App/>, document.getElementById('root'))
