const QUOTE_API = 'https://api.quotable.io/random';
const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyQuoteBtn = document.getElementById('copy-quote-btn');
const quoteCard = document.querySelector('.quote-card');

const factText = document.getElementById('fact-text');
const newFactBtn = document.getElementById('new-fact-btn');
const copyFactBtn = document.getElementById('copy-fact-btn');
const shareFactBtn = document.getElementById('share-fact-btn');
const factCard = document.querySelector('fact-card');

const toast = document.getElementById('toast');

let currentQuote = { text: '', author: '' };
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

// Save Quote to Local Storage
function saveQuoteToStorage(quote) {
    localStorage.setItem('dailyQuote', JSON.stringify(quote));
}

// Get quote from local storage
function getQuoteFromStorage() {
    const saved = localStorage.getItem('dailyQuote');
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

async function fetchQuote() {
    if (!forceNew && !isNewDay()) {
        const cachedQuote = getQuoteFromStorage();
        if (cachedQuote) {
            currentQuote = cachedQuote;
            displayQuote();
            return;
        }
    }

    try {
        quoteCard.classList.add('loading');
        newQuoteBtn.disabled = true;
        const response = await fetch(QUOTE_API);

        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        currentQuote = {
            text: data.content,
            author: data.author
        };
        saveQuoteToStorage(currentQuote);
        displayQuote();
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = 'Could not load quote. Please try again.';
        quoteAuthor.textContent = '';
    } finally {
        quoteCard.classList.remove('loading');
        newQuoteBtn.disabled = false;
    }
}

function displayQuote() {
    quoteText.textContent = `"${currentQuote.text}"`;
    quoteAuthor.textContent = `- ${currentQuote.author}`;
}

async function copyQuote() {
    const textToCopy = `"${currentQuote.text}" - ${currentQuote.author}`;
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Quote copied to clipboard!');
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Quote copied to clipboard!');
    }
}

function getNewQuote() {
    fetchQuote(true);
    showToast('Loading new quote...');
}

async function fetchFact() {
    if (!forceNew && !isNewDay()) {
        const cachedFact = getFactFromStorage();
        if (cachedFact) {
            currentFact = cachedFact;
            displayFact();
            return;
        }
    }

    try {
        factCard.classList.add('loading');
        newFactBtn.disabled = true;
        const response = await fetch(FACT_API);
        if (!response.ok) {
            throw new Error('Failed to fetch fact');
        }
        const data = await response.json();
        currentFact = data.text;

        saveFactToStorage(currentFact);
        displayFact();
    } catch (error) {
        console.error('Error fetching fact:', error);
        factText.textContent = 'Could not load fact. Please try again.';
    } finally {
        factCard.classList.remove('loading');
        newFactBtn.disabled = false;
    }
}

function displayFact() {
    factText.textContent = currentFact;
}

async function copyFact() {
    try {
        await navigator.clipboard.writeText(currentFact);
        showToast('Fact copied to clipboard!');
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = currentFact;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Fact copied to clipboard!');
    }
}

function shareFact() {
    if (navigator.share) {
        navigator.share({
            title: 'Did you know?',
            text: currentFact
        })
        .then(() => console.log('Fact shared Successfully'))
        .catch((error) => console.log('Error sharing fact:', error)); 
    } else {
        copyFact();
    }
}

function getNewFact() {
    fetchFact(true);
    showToast('Loading new fact...');
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initializeApp() {
    console.log('Initializing Byte Snack App...');
    if (isNewDay()) {
        console.log('New day detected. Fetching new content...');
        updateLastVisitDate();
        fetchQuote(true);
        fetchFact(true);
    } else {
        console.log('Still the same day. Loading cached content...');
        fetchQuote(false);
        fetchFact(false);
    }
}

newQuoteBtn.addEventListener('click', getNewQuote);
copyQuoteBtn.addEventListener('click', copyQuote);

newFactBtn.addEventListener('click', getNewFact);
copyFactBtn.addEventListener('click', copyFact);
shareFactBtn.addEventListener('click', shareFact);

document.addEventListener('keydown', (e) => {
    if (e.key === 'q' || e.key === 'Q') {
        getNewQuote();
    }
    if (e.key === 'f' || e.key === 'F') {
        getNewFact();
    }
});

window.addEventListener('load', initializeApp);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isNewDay()) {
        console.log('Page visible & new day... refreshing content...');
        updateLastVisitDate();
        fetchQuote(true);
        fetchFact(true);
        showToast('Welcome new day! new inspirations!');
    }
});