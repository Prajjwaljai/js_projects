let form = document.querySelector("form");
let username = document.querySelector("#name");
let role = document.querySelector("#role");
let bio = document.querySelector("#bio");
let photo = document.querySelector("#photo");

const userManager = {
  users: [],

  init: function () {
    // Load saved users from localStorage
    const stored = localStorage.getItem("users");
    if (stored) {
      this.users = JSON.parse(stored);
      this.renderUi();
    }

    form.addEventListener("submit", this.submitForm.bind(this));
  },

  submitForm: function (e) {
    e.preventDefault();
    this.addUser();
  },

  addUser: function () {
    this.users.push({
      username: username.value,
      role: role.value,
      bio: bio.value,
      photo: photo.value,
    });

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(this.users));

    form.reset();
    this.renderUi();
  },

  renderUi: function () {
    document.querySelector(".users").innerHTML = "";
    this.users.forEach((user, index) => {
      const card = document.createElement("div");
      card.className =
        "relative bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 hover:scale-105 transition";

      // Close (X) Button
      const closeBtn = document.createElement("span");
      closeBtn.innerHTML = "&times;"; // × symbol
      closeBtn.className =
        "absolute top-2 right-3 text-gray-400 hover:text-red-500 text-lg cursor-pointer transition";
      closeBtn.addEventListener("click", () => {
        card.classList.add("opacity-0", "transition", "duration-500");
        setTimeout(() => {
          this.removeUser(index);
        }, 500);
      });
      card.appendChild(closeBtn);

      // Image
      const img = document.createElement("img");
      img.className =
        "w-28 h-28 rounded-full object-cover mb-5 border-4 border-blue-200 shadow";
      img.src = user.photo;
      img.alt = "User Photo";
      card.appendChild(img);

      // Name
      const name = document.createElement("h2");
      name.className = "text-2xl font-bold mb-1 text-blue-700";
      name.textContent = user.username;
      card.appendChild(name);

      // Role
      const role = document.createElement("p");
      role.className = "text-purple-500 mb-2 font-medium";
      role.textContent = user.role;
      card.appendChild(role);

      // Description
      const desc = document.createElement("p");
      desc.className = "text-gray-700 text-center";
      desc.textContent = user.bio;
      card.appendChild(desc);

      document.querySelector(".users").appendChild(card);
    });
  },

  removeUser: function (index) {
    this.users.splice(index, 1);

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(this.users));

    this.renderUi();
  },
};

userManager.init();
