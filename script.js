const QOUTE_API = 'https://api.quotable.io/random';
const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

const qouteText = document.getElementById('qoute-text');
const qouteAuthor = document.getElementById('qoute-author');
const newQouteBtn = document.getElementById('new-qoute-btn');
const copyQouteBtn = document.getElementById('copy-qoute-btn');
const qouteCard = document.getElementById('qoute-card');

const factText = document.getElementById('fact-text');
const newFactBtn = document.getElementById('new-fact-btn');
const copyFactBtn = document.getElementById('copy-fact-btn');
const shareFactBtn = document.getElementById('share-fact-btn');
const factCard = document.getElementById('fact-card');

const toast = document.getElementById('toast');

let currentQoute = { text: '', author: '' };
let currentFact = '';

