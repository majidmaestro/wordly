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
const examplesContainer = document.getElementById("examples");
const synonymsContainer = document.getElementById("synonyms");
const antonymsContainer = document.getElementById("antonyms");

const sourceContainer = document.getElementById("source");

const favoritesList = document.getElementById("favoritesList");
const emptyFavorites = document.getElementById("emptyFavorites");

const themeBtn = document.getElementById("themeBtn");

// storing the current searched word and its data
// When the page first loads, the user has not searched anything - it stays null
let currentWord = null;
let currentAudio = null; // store the audio globally so we can play it when the user clicks the audio button
// storing favorite words
// we check localStorage first because the user might already have saved words
// json converts those strings to arrays - get my favourites if none start with empty array
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// event listener - runs when the user submits the search form
searchForm.addEventListener("submit", handleSearch);
audioBtn.addEventListener("click", playAudio);
favoriteBtn.addEventListener("click", saveFavorite);

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
      showError(
        "We could not find the word you searched for. Please check the spelling and try again.",
      );

      return;
    }
    // convert the response to Json(javascript data) and store it in a variable called data
    const data = await response.json();

    // log the data to the console for debugging purposes
    // console.log("Dictionary data:", data);

    // sending the data to the function that will display it to the user
    displayWord(data);
  } catch (error) {
    // if something goes wrong (network error, API down, etc.), we catch the error and show a message to the user
    showError(
      "Something went wrong while loading the definition. Please try again.",
    );

    console.log("Error fetching word:", error);
  } finally {
    // hide the loading message and enable the search button whether the request worked or failed
    // finally always runs whether the request succeeds or fails
    setLoading(false);
  }
}

//  showing the data to the user
// function to display the word data to the user
function displayWord(data) {
  // get the first word for the API response (the API returns an array of words, but we only want the first one)
  const entry = data[0]; // because the API returns an array of words, we only want the first one
  //   console.log("displayedWord is running");
  // display the word
  wordTitle.textContent = entry.word;

  //  check if the API has phonetic information
  if (entry.phonetics.length > 0) {
    // finding the first phoneticthat has text
    // i go through the phonetic array and i give the first object that actually has pronuncitiation text
    const phoneticData = entry.phonetics.find((item) => item.text);

    if (phoneticData) {
      phonetic.textContent = phoneticData.text;
    } else {
      phonetic.textContent = "No pronunciation available.";
    }
  } else {
    phonetic.textContent = "No pronunciation available.";
  }

  // clear previous things b4 showing new data
  // empties the meanings container so that we can add new meanings for the new word
  meaningsContainer.innerHTML = "";
  examplesContainer.innerHTML = "";
  synonymsContainer.innerHTML = "";
  antonymsContainer.innerHTML = "";
  sourceContainer.innerHTML = "";

  // arrays where we will store all synonyms and antonyms
  let examples = [];
  let synonyms = [];
  let antonyms = [];

  // go through each meaning from the API
  entry.meanings.forEach(function (meaning) {
    // create heading for part of speech
    const partOfSpeech = document.createElement("h3");
    partOfSpeech.textContent = meaning.partOfSpeech;

    // create paragraph for definition
    const definition = document.createElement("p");
    definition.textContent = meaning.definitions[0].definition;

    // check if the defination has an example sentence
    if (meaning.definitions[0].example) {
      examples.push(meaning.definitions[0].example);
    }

    // display examples only when they exist
    if (examples.length > 0) {
      examplesContainer.innerHTML = `
        <h3>Examples</h3>
        <p>${examples.join("<br>")}</p>
    `;
    } else {
      examplesContainer.innerHTML = "";
    }

    // add them to the meanings section
    meaningsContainer.appendChild(partOfSpeech);
    meaningsContainer.appendChild(definition);

    // check if synonyms exist in the meaning object
    if (meaning.synonyms) {
      synonyms = synonyms.concat(meaning.synonyms);
    }

    // check if antonyms exist in the meaning object
    if (meaning.antonyms) {
      antonyms = antonyms.concat(meaning.antonyms);
    }
  });

  //   to display the synonym
  // display synonyms
  if (synonyms.length > 0) {
    synonymsContainer.innerHTML = `
        <h3>Synonyms</h3>
        <p>${synonyms.join(", ")}</p>
    `;
  } else {
    synonymsContainer.innerHTML = `
        <h3>Synonyms</h3>
        <p>No synonyms available.</p>
    `;
  }

  //   to display the antonyms
  // display antonyms
  if (antonyms.length > 0) {
    antonymsContainer.innerHTML = `
        <h3>Antonyms</h3>
        <p>${antonyms.join(", ")}</p>
    `;
  } else {
    antonymsContainer.innerHTML = `
        <h3>Antonyms</h3>
        <p>No antonyms available.</p>
    `;
  }

  currentAudio = null; // reset the current audio before checking for new audio

  // go through all the phonetics
  entry.phonetics.forEach(function (item) {
    // if this phonetic has an audio link, save it
    if (item.audio) {
      currentAudio = item.audio;
    }
  });
  //   console.log(currentAudio);

  // show the audio button only if we found an audio file
  if (currentAudio) {
    audioBtn.classList.remove("hidden");
  } else {
    audioBtn.classList.add("hidden");
  }
  // show the favorite button after a word is successfully found
  favoriteBtn.classList.remove("hidden");

  // display source link if the API provides one
  if (entry.sourceUrls && entry.sourceUrls.length > 0) {
    sourceContainer.innerHTML = `
        Source:
        <a href="${entry.sourceUrls[0]}" target="_blank">
            ${entry.sourceUrls[0]}
        </a>
    `;
  } else {
    sourceContainer.innerHTML = "";
  }
}

// function to play the word pronounciation
function playAudio() {
  // check if we actually have an audio link
  if (currentAudio) {
    // create a new audio object using the API audio link
    // this Creates audio player - load the audio link - prepare to play
    const audio = new Audio(currentAudio);

    // play the audio
    audio.play();
  } else {
    // if no audio exists, show a message
    showError("No pronunciation audio available.");
  }
}

// function to save a word as a favorite
function saveFavorite() {
  // checking if there is a word searched
//   console.log("favourite button clicked");
  if (!currentWord) {
    return;
  }

  // checking if the word is already saved
  if (favorites.includes(currentWord)) {
    showError("This word is already in your favorites.");
    return;
  }

  // adding the word to the favorites array
  favorites.push(currentWord);

  // saving the updated array into localStorage
  // localStorage.setItem() - saves it permanently
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // update the favorites displayed on the page
  displayFavorites();

  // small message for testing
//   console.log("Saved favorites:", favorites);
}

// function to display saved favorite words on the page
function displayFavorites() {
  // clear the current favorites list before adding new ones
  favoritesList.innerHTML = "";

  // if there are no favorites, show a message
  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");

    return;
  }

  // hide the empty message if we have favorites
  emptyFavorites.classList.add("hidden");

  // go through each favorite word and display it
  favorites.forEach(function (word) {
    // create a container for each favorite word
    const favoriteItem = document.createElement("div");

    // create the word text
    const wordText = document.createElement("p");
    wordText.textContent = word;

    wordText.addEventListener("click", function () {
      wordInput.value = word;

      searchForm.dispatchEvent(new Event("submit"));
    });

    // create remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";

    // add remove functionality
    // remove the word when the button is clicked
    removeBtn.addEventListener("click", function () {
      // remove this word from the favorites array
      // .filter creates a new array updated one without the removed word
      favorites = favorites.filter(function (item) {
        return item !== word;
      });

      // update localStorage after removing
      localStorage.setItem("favorites", JSON.stringify(favorites));

      // refresh the favorites list on the page
      displayFavorites();

      console.log("Removed:", word);
    });

    // put everything together
    favoriteItem.appendChild(wordText);
    favoriteItem.appendChild(removeBtn);

    // add it to the page
    favoritesList.appendChild(favoriteItem);
  });
}
// show saved favorites when the page loads
displayFavorites();

// changing between light mode and dark mode
themeBtn.addEventListener("click", function () {

    // add or remove the dark theme class
    // checks if the body currently has darktheme
    document.body.classList.toggle("dark-theme");

});