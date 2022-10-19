const main = document.querySelector(".happy");
const checkbox = document.querySelector(".checkbox");
const thoughtsSection = document.querySelector(".thoughts__container");
const newThought = document.querySelector(".question__container-form");
const newThoughtText = document.querySelector(".question__container-input");
const button = document.querySelector(".question__container-button");
const error = document.querySelector(".error");

const URL = "http://happy-thoughts-api-sprint-4.herokuapp.com";

checkbox.addEventListener("click", () => {
  main.classList.toggle("darktheme");
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
            <img class="close" data-id="${
              thought._id
            }" src="./assets/close.png" title="close" alt="close">
            <p class="added__thought-text">${thought.message}</p>
            <div class="likes">
            <div class="heart ${
              thought.hearts > 0 && "heart-liked"
            }" data-id="${thought._id}">❤️</div>
            <p class="number-of-likes">x ${thought.hearts}</p>
            </div>
            </div>
            `;
      });
      const closeButtons = document.querySelectorAll(".close");
      closeButtons.forEach((singleCloseButton) => {
        singleCloseButton.addEventListener("click", (event) => {
          deleteHappyThought();
        });
      });
      const likeButtons = document.querySelectorAll(".heart");
      likeButtons.forEach((singleLike) => {
        singleLike.addEventListener("click", (event) => {
          likeHappyThought();
        });
      });
    })
    .catch((err) => console.log(err));
};

fetchThoughts();

const addHappyThought = () => {
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
  error.classList.remove("visible");
  newThoughtText.value = "";
};

newThought.addEventListener("submit", (event) => {
  event.preventDefault();
  if (newThoughtText.value.length > 3) {
    addHappyThought();
  } else {
    error.classList.add("visible");
  }
});

const likeHappyThought = () => {
  const options = {
    method: "PUT",
  };
  fetch(`${URL}/thoughts/like/${event.target.dataset.id}`, options).then(() =>
    fetchThoughts()
  );
};

const deleteHappyThought = () => {
  const options = {
    method: "DELETE",
  };
  fetch(`${URL}/thoughts/${event.target.dataset.id}`, options).then(() =>
    fetchThoughts()
  );
};
