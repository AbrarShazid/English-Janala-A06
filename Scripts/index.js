function startSpinner() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("cardContainer").classList.add("hidden");
}

function stopSpinner() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("cardContainer").classList.remove("hidden");
}

// global part of each section

const navbar = document.getElementById("navbar");
const banner = document.getElementById("banner");

// log in validation part

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "") {
      alert("Enter a User Name!");
      return;
    }
    if (password === "") {
      alert("Enter a Password!");
      return;
    }
    if (password !== "123456") {
      alert("Incorrect password!");
      document.getElementById("loginForm").reset();
      return;
    }

    alert("Login successful!");
    navbar.classList.remove("hidden");
    document.getElementById("learn").classList.remove("hidden");
    document.getElementById("faq").classList.remove("hidden");
    banner.classList.add("hidden");

    document.getElementById("loginForm").reset();
  });

// log out part

function logOut() {
  navbar.classList.add("hidden");
  document.getElementById("learn").classList.add("hidden");
  document.getElementById("faq").classList.add("hidden");
  banner.classList.remove("hidden");
}

// load all lesson index

function loadIndex() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((all) => {
      displayIndex(all.data);
    });
}

function displayIndex(allData) {
  const lessonIndex = document.getElementById("lessonIndex");
  for (let data of allData) {
    const div = document.createElement("div");
    div.innerHTML = `
         <button id=${data.id} onclick="loadCards(${data.level_no}); colorButton(${data.id})" class="text-sm font-semibold text-[#422AD5] border border-[#422AD5] rounded px-4 py-2 hover:bg-[#422AD5] hover:text-white"><i class="fa-solid fa-book-open"></i> Lesson -${data.level_no}</button>
         `;

    lessonIndex.appendChild(div);
  }
}

// change color of index button

function colorButton(indexId) {
  const allActive = document.querySelectorAll(".active");
  allActive.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(indexId).classList.add("active");
}

// loading cards of words based on lesson button click
function loadCards(levelNo) {
  startSpinner();

  const url = `https://openapi.programming-hero.com/api/level/${levelNo}`;

  fetch(url)
    .then((res) => res.json())
    .then((allCard) => {
      stopSpinner();
      showCard(allCard.data);
    });
}

// show card in page
function showCard(allWords) {
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";
  // handling if any lesson doesnot contain any word
  if (allWords.length === 0) {
    cardContainer.classList.remove("grid", "grid-cols-3");

    const div = document.createElement("div");

    div.classList.add("flex", "flex-col", "gap-4");

    div.innerHTML = `

    <i class="fa-solid fa-triangle-exclamation text-[80px] text-gray-600 opacity-60"></i>
  <p class="text-sm text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
  <h2 class="text-[#292524] text-2xl font-medium">নেক্সট Lesson এ যান</h2>
  `;
    cardContainer.appendChild(div);
  }

  for (const word of allWords) {
    cardContainer.classList.add("grid", "grid-cols-3");
    const div = document.createElement("div");
    div.classList.add(
      "bg-[#FFF]",
      "rounded-xl",
      "p-11",
      "space-y-5",
      "hover:bg-sky-50"
    );

    div.innerHTML = `
      
  
      <h3 class="text-3xl font-bold">${word.word}</h3>
          <p class="text-xl font-medium">Meaning /Pronounciation</p>
          <h3 class="text-3xl font-semibold opacity-80 ">${
            word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"
          } / ${word.pronunciation}"</h3>
          <!-- icon  -->
          <div class="flex items-center justify-between"> 
            <button onclick="my_modal_1.showModal(); loadInfo(${
              word.id
            })" class="bg-[#1A91FF1A] rounded-lg p-3"><i class="fa-solid fa-circle-info opacity-80 "></i></button>
            <button class="bg-[#1A91FF1A] rounded-lg p-3"><i class="fa-solid fa-volume-high opacity-80"></i></button>

          </div>

  
  
  `;
    cardContainer.appendChild(div);
  }
}

// load info of word  for modal

function loadInfo(wordId) {
  const url = `https://openapi.programming-hero.com/api/word/${wordId}`;

  fetch(url)
    .then((res) => res.json())
    .then((wordInfo) => displayInfo(wordInfo.data));
}

// display info of word in modal

function displayInfo(wordInfo) {
  const modal = document.getElementById("infoModal");
  modal.innerHTML = ``;

  const div = document.createElement("div");

  div.classList.add("border-2", "border-[#EDF7FF]", "rounded-lg", "p-3");

  div.innerHTML = `

  <h2 class="text-3xl font-semibold mb-6">${
    wordInfo.word
  } (<i class="fa-solid fa-microphone-lines"></i> :${
    wordInfo.pronunciation || "উচ্চারণ পাওয়া যায় নি"
  })</h2>

              <div class="space-y-2 mb-6">
                <h3 class="text-xl font-semibold">Meaning</h3>
                <p class="text-xl font-medium">${
                  wordInfo.meaning ? wordInfo.meaning : "অর্থ পাওয়া যায় নি"
                }</p>
              </div>

              <div class="space-y-2 mb-6">
                <h3 class="text-xl font-semibold">Example</h3>
                <p class="text-xl opacity-80">${
                  wordInfo.sentence
                    ? wordInfo.sentence
                    : "উদাহরণ পাওয়া যায় নি।"
                }</p>
              </div>

              <div class="space-y-2 ">
                <h3 class="text-xl font-medium">সমার্থক শব্দ গুলো</h3>

                 <div id="synonymContainer" class="flex flex-wrap gap-2"></div>
            
            
             </div>

`;

  const synonymContainer = div.querySelector("#synonymContainer");

  if (wordInfo.synonyms && wordInfo.synonyms.length > 0) {
    for (let i = 0; i < wordInfo.synonyms.length; i++) {
      const button = document.createElement("button");
      button.classList.add(
        "px-3",
        "py-2",
        "rounded-md",
        "border",
        "border-[#D7E4EF]",
        "bg-[#EDF7FF]",
        "text-lg",
        "opacity-80"
      );
      button.textContent = wordInfo.synonyms[i];
      synonymContainer.appendChild(button);
    }
  } else {
    // If no synonyms are available
    synonymContainer.innerHTML = `<p class="text-lg text-gray-500">সমার্থক শব্দ পাওয়া যায় নি</p>`;
  }

  const closingDiv = document.createElement("div");
  closingDiv.classList.add("modal-action", "justify-start");

  closingDiv.innerHTML = `
  
     <form method="dialog">
                <!-- The close button -->
                <button class="btn text-white bg-[#422AD5]">Complete Learning</button>
              </form>
  
  `;

  modal.appendChild(div);
  modal.appendChild(closingDiv);
}

// all function call
loadIndex();
