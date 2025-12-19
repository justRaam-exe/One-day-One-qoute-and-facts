const QOUTE_API = 'https://api.quotable.io/random';
const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

const qouteText = document.getElementById('qoute-text');
const qouteAuthor = document.getElementById('qoute-author');
const newQouteBtn = document.getElementById('new-qoute-btn');
const copyQouteBtn = document.getElementById('copy-qoute-btn');
const qouteCard = document.querySelector('qoute-card');

const factText = document.getElementById('fact-text');
const newFactBtn = document.getElementById('new-fact-btn');
const copyFactBtn = document.getElementById('copy-fact-btn');
const shareFactBtn = document.getElementById('share-fact-btn');
const factCard = document.querySelector('fact-card');

const toast = document.getElementById('toast');

let currentQoute = { text: '', author: '' };
let currentFact = '';

// Get today's date in string YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Check if it is a new day
function isNewDay() {
    const savedDate = localStorage.getItem('lastVisitDate');
    const todayDate = getTodayDate();
    return savedDate !== todayDate;
}

// Update Last Visit Date
function updateLastVisitDate() {
    localStorage.setItem('lastVisitDate', getTodayDate());
}

// Save Qoute to Local Storage
function saveQouteToStorage(qoute) {
    localStorage.setItem('dailyQoute', JSON.stringify(qoute));
}

// Get qoute from local storage
function getQouteFromStorage() {
    const saved = localStorage.getItem('dailyQoute');
    return saved ? JSON.parse(saved) : null;
}

// Save fact to local storage
function saveFactToStorage(fact) {
    localStorage.setItem('dailyFact', fact);
}

// get fact from local storage
function getFactFromStorage() {
    return localStorage.getItem('dailyFact');
}

async function fetchQoute() {
    if (!forceNew && !isNewDay()) {
        const cachedQoute = getQouteFromStorage();
        if (cachedQoute) {
            currentQoute = cachedQoute;
            displayQoute();
            return;
        }
    }

    try {
        qouteCard.classList.add('loading');
        newQouteBtn.disabled = true;
        const response = await fetch(QOUTE_API);

        if (!response.ok) {
            throw new Error('Failed to fetch qoute');
        }
        const data = await response.json();
        currentQoute = {
            text: data.content,
            author: data.author
        };
        saveQouteToStorage(currentQoute);
        displayQoute();
    } catch (error) {
        console.error('Error fetching qoute:', error);
        qouteText.textContent = 'Could not load qoute. Please try again.';
        qouteAuthor.textContent = '';
    }
}