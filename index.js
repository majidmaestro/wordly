// getting element from our html page

const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");

const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");

const resultsSection = document.getElementById("results");

const wordTitle = document.getElementById("displayWord");
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
// When the page first loads, the user has not searched anything - it stays null
let currentWord = null;
let currentAudio = null;  // store the audio globally so we can play it when the user clicks the audio button


// event listener - runs when the user submits the search form
searchForm.addEventListener("submit", handleSearch);

// function to handle the search
// we use async because we will be fetching data from the API using wait
async function handleSearch(event) {
    // prevent the form from submitting normally
    event.preventDefault();

    // get the word from the input and remove extra spaces
    const word = wordInput.value.trim();

    // check if the user entered anything
    // if the input is empty, stop the function and show an error
    if (word === "") {
        showError("Please enter a word to search.");
        return;
    }

    // save the searched word and change it to lowercase
    currentWord = word.toLowerCase();

    // remove any previous error
    clearError();

    // show the loading message
    setLoading(true);

    // this is just useful while testing
    // logs the searched word to the console
    console.log("Searching for:", word);

    // get the word from the API - this is an async function that returns a promise
    await fetchWord(currentWord);
}

// error messages
// show an error message to the user
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden"); // show the error message by removing the hidden class
}

// hide the current error message
function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden"); // hide the error message by adding the hidden class
}

// function to control the loading state
// show or hide the loading message
function setLoading(isLoading) {
  if (isLoading) {
    loadingMessage.classList.remove("hidden");
    searchBtn.disabled = true;
  } else {
    loadingMessage.classList.add("hidden");
    searchBtn.disabled = false;
  }
  //   when fetching starts, setLoading(true) is called to show the loading message and disable the search button.
  // When fetching ends, setLoading(false) is called to hide the loading message and enable the search button.
}

// gets the data
// fetch the word from the API
async function fetchWord(word) {
    // if everything goes well, we will get the word data from the API and log it to the console
    try {
      // fetch the word from the API
      // encodeURIComponent() - used to encode the word so that it can be safely included in the URL
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      );

    //   check if the response is ok
        if (!response.ok) {
            showError('We could not find the word you searched for. Please check the spelling and try again.');

            return;
        }
        // convert the response to Json(javascript data) and store it in a variable called data
        const data = await response.json();

        // log the data to the console for debugging purposes
        console.log("Dictionary data:", data);

        // sending the data to the function that will display it to the user
        displayword(data);


    } catch (error) {
        // if something goes wrong (network error, API down, etc.), we catch the error and show a message to the user
        showError("Something went wrong while loading the definition. Please try again.");

        console.log("Error fetching word:", error);

    } finally {
        // hide the loading message and enable the search button whether the request worked or failed
        // finally always runs whether the request succeeds or fails
        setLoading(false);
    }
}

//  showing the data to the user
// function to display the word data to the user
function displayword(data) {
    // get the first word for the API response (the API returns an array of words, but we only want the first one)
    const entry = data[0];
    
    // display the word 
    wordTitle.textContent = entry.word;

    //  check if the API has phonetic information 
}