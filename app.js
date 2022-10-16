const body = document.querySelector(".body");
const checkbox = document.querySelector(".checkbox");
const thoughtsSection = document.querySelector(".thoughts__container");
const newThought = document.querySelector(".question__container-form");
const newThoughtText = document.querySelector(".question__container-input");
const button = document.querySelector(".question__container-button");
const error = document.querySelector(".error");

const URL = "http://happy-thoughts-api-sprint-4.herokuapp.com";

checkbox.addEventListener("click", () => {
  body.classList.toggle("darktheme");
});

let arrayOfThoughts = [];

const fetchThoughts = () => {
  fetch(`${URL}/thoughts`)
    .then((res) => res.json())
    .then((data) => {
      arrayOfThoughts = data.data;
      thoughtsSection.innerHTML = "";
      data.data.forEach((thought) => {
        thoughtsSection.innerHTML += `
            <div class="added__thought">
            <img class="close" data-id="${thought._id}" src="./assets/close.png" title="close" alt="close">
            <p class="added__thought-text">${thought.message}</p>
            <div class="likes">
            <div class="heart">❤️</div>
            <p class="number-of-likes">x ${thought.hearts}</p>
            </div>
            </div>
            `;
      });
      const closeButton = document.querySelectorAll(".close");
      closeButton.forEach((singleCloseButton) => {
        singleCloseButton.addEventListener("click", (event) => {
          const options = {
            method: "DELETE",
          };
          fetch('${URL}/thoughts/${event.target.dataset.id}', options)
          .then(() => {
            arrayOfThoughts = arrayOfThoughts.filter((item) => {
              return item._id !== event.target.dataset.id;
            });
          }
          );
        });
      });
    })
    .catch((err) => console.log(err));
};

fetchThoughts();

newThought.addEventListener("submit", (event) => {
  event.preventDefault();
  if (newThoughtText.value) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: newThoughtText.value,
      }),
    };
    fetch(`${URL}/thoughts`, options)
      .then(() => fetchThoughts())
      .catch((err) => (error.innerText = "Something went wrong"));
  } else {
    error.innerText = "Please fill in happy thoughts input";
  }
});

