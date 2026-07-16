// getting element from our html page

const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");

const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");

const resultsSection = document.getElementById("results");

const displayWord = document.getElementById("displayWord");
const phonetic = document.getElementById("phonetic");

const audioBtn = document.getElementById("audioBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const meaningsContainer = document.getElementById("meanings");
const synonymsContainer = document.getElementById("synonyms");
const antonymsContainer = document.getElementById("antonyms");

const sourceContainer = document.getElementById("source");

const favoritesList = document.getElementById("favoritesList");
const emptyFavorites = document.getElementById("emptyFavorites");

const themeBtn = document.getElementById("themeBtn");

// storing the current searched word and its data
let currentWord = null;
let currentAudio = null;

// event listener - runs when the user submits the search form
searchForm.addEventListener("submit", handleSearch);

function handleSearch(event) {
  // prevent the form from submitting normally
  event.preventDefault(); // prevent the form from submitting normally

  // get the input value and trim whitespace
  const word = wordInput.value.trim(); // get the input value and trim whitespace
 
  // log the searched word
  console.log("Searching for:", word); // log the searched word
}