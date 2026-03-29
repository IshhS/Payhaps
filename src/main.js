import './style.css';
import App, { init3DBackground } from './App.js';

// 1. Inject the HTML into the DOM just like you were doing
document.querySelector('#app').innerHTML = App();

// 2. Fire up the 3D canvas now that the element actually exists
init3DBackground();