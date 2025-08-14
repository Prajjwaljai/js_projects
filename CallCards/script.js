//variables-Incluion
const tasks = [];

let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");
let noteContainer = document.querySelector(".note-container"); // the whole card layout
const stack = document.querySelector(".stack");
const prevCardBtn = document.querySelector('#prev-card');
const nextCardBtn = document.querySelector('#next-card');

// Select the entire form
const form = document.querySelector('form');

// Select inputs by their IDs
const imageUrlInput = document.querySelector('#image-url');
const fullNameInput = document.querySelector('#full-name');
const homeTownInput = document.querySelector('#home-town');
const purposeInput = document.querySelector('#purpose');

// Select all radio buttons with name="category"
const categoryRadios = document.querySelectorAll('input[name="category"]');

// Select the submit button
const submitBtn = document.querySelector('.submit-btn');

// ===== MESSAGE MODAL LOGIC =====
const messageModal = document.getElementById("message-modal");
const messageText = document.getElementById("message-text");
const saveMessageBtn = document.getElementById("save-message");
const cancelMessageBtn = document.getElementById("cancel-message");

// ===== CALL MODAL LOGIC WITH RINGTONE =====
const callModal = document.getElementById("call-modal");
const callStatus = document.getElementById("call-status");
const callTimer = document.getElementById("call-timer");
const endCallBtn = document.getElementById("end-call");

function saveToLocalStorage(taskObj) {
    if (localStorage.getItem("tasks") === null) {
        let oldTasks = [];
        oldTasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
    } else {
        let oldTasks = JSON.parse(localStorage.getItem("tasks"));
        oldTasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
    }
}

addNote.addEventListener("click", function () {
    formContainer.classList.remove("hidden");   // show form
    noteContainer.classList.add("hidden");      // hide card stack layout
});

closeForm.addEventListener("click", function () {
    formContainer.classList.add("hidden");      // hide form
    noteContainer.classList.remove("hidden");   // show card stack layout
});

form.addEventListener("submit", function(evt) {
    evt.preventDefault();

    const imageUrl = imageUrlInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const homeTown = homeTownInput.value.trim();
    const purpose = purposeInput.value.trim();

    const selectedCategoryRadio = document.querySelector('input[name="category"]:checked');
    const category = selectedCategoryRadio ? selectedCategoryRadio.value : null;

    if (!imageUrl || !fullName || !homeTown || !purpose) {
        alert("Please fill in all fields.");
        return;
    }

    if (!category) {
        alert("Please select a category.");
        return;
    }

    saveToLocalStorage({
        imageUrl,
        fullName,                                              
        homeTown,
        purpose,
        category,
    });

    form.reset();
    formContainer.classList.add("hidden");
    noteContainer.classList.remove("hidden");
});

function showCards() {
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const stack = document.querySelector(".stack"); 
    stack.innerHTML = ""; // clear old cards

    allTasks.forEach(function (task) {
        // Create card container
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-category", task.category);

        // Avatar image
        const avatar = document.createElement("img");
        avatar.src = task.imageUrl;
        avatar.alt = "Profile picture";
        avatar.classList.add("avatar");
        card.appendChild(avatar);

        // Name
        const name = document.createElement("h3");
        name.classList.add("name");
        name.textContent = task.fullName;
        card.appendChild(name);

        // Home town row
        const row1 = document.createElement("div");
        row1.classList.add("info-row");
        row1.innerHTML = `<span>Home town</span><span>${task.homeTown}</span>`;
        card.appendChild(row1);

        // Purpose row
        const row2 = document.createElement("div");
        row2.classList.add("info-row");
        row2.innerHTML = `<span>Purpose</span><span>${task.purpose}</span>`;
        card.appendChild(row2);

        // Card actions container
        const cardActions = document.createElement("div");
        cardActions.classList.add("card-actions");

        // Call button
        const callBtn = document.createElement("button");
        callBtn.classList.add("call-btn");
        callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';
        cardActions.appendChild(callBtn);

        // Message button
        const msgBtn = document.createElement("button");
        msgBtn.classList.add("message-btn");
        msgBtn.textContent = "Message";
        cardActions.appendChild(msgBtn);

        // Append actions to card
        card.appendChild(cardActions);

        // Append card to stack
        stack.appendChild(card);
    });
}

showCards();

function updateStack() {
    const cards = document.querySelectorAll(".stack .card");
    for (let index = 0; index < 3; index++) {
        if (cards[index]) {
            cards[index].style.zIndex = 3 - index;
            cards[index].style.transform = `translateY(${index * 10}px) scale(${1 - index * 0.02})`;
            cards[index].style.opacity = `${1 - index * 0.02}`;
        }
    }
}

prevCardBtn.addEventListener('click', () => {
    const firstCard = stack.querySelector(".card");
    if (firstCard) {
        stack.appendChild(firstCard);
        updateStack();
    }
});

nextCardBtn.addEventListener('click', () => {
    const lastCard = stack.querySelector(".card:last-child");
    if (lastCard) {
        stack.insertBefore(lastCard, stack.firstChild);
        updateStack();
    }
});

// ===== MESSAGE MODAL =====
let activeCardIndexMsg = null;

function openMessageModal(index) {
    activeCardIndexMsg = index;
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    messageText.value = allTasks[index]?.message || "";
    messageModal.classList.remove("hidden");
    noteContainer.classList.add("blur");
    formContainer.classList.add("blur");
}

function closeMessageModal() {
    messageModal.classList.add("hidden");
    noteContainer.classList.remove("blur");
    formContainer.classList.remove("blur");
    activeCardIndexMsg = null;
}

saveMessageBtn.addEventListener("click", () => {
    if (activeCardIndexMsg === null) return;
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (allTasks[activeCardIndexMsg]) {
        allTasks[activeCardIndexMsg].message = messageText.value.trim();
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }
    closeMessageModal();
});

cancelMessageBtn.addEventListener("click", closeMessageModal);

// ===== CALL MODAL =====
const ringtone = new Audio("ringtone.mp3");
ringtone.loop = true;

let callInterval = null;
let callSeconds = 0;
let activeCallIndex = null;

function openCallModal(index) {
    activeCallIndex = index;
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let name = allTasks[index]?.fullName || "Unknown";

    callStatus.textContent = `Calling ${name}...`;
    callTimer.textContent = "00:00";
    callSeconds = 0;

    callModal.classList.remove("hidden");
    noteContainer.classList.add("blur");
    formContainer.classList.add("blur");

    ringtone.currentTime = 0;
    ringtone.play().catch(err => console.log("Audio play blocked:", err));

    setTimeout(() => {
        ringtone.pause();
        ringtone.currentTime = 0;
        callStatus.textContent = `On Call with ${name}`;
        callInterval = setInterval(() => {
            callSeconds++;
            let mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
            let secs = String(callSeconds % 60).padStart(2, "0");
            callTimer.textContent = `${mins}:${secs}`;
        }, 1000);
    }, 2000);
}

function closeCallModal() {
    clearInterval(callInterval);
    ringtone.pause();
    ringtone.currentTime = 0;
    callModal.classList.add("hidden");
    noteContainer.classList.remove("blur");
    formContainer.classList.remove("blur");
    activeCallIndex = null;
}

endCallBtn.addEventListener("click", () => {
    if (activeCallIndex !== null) {
        let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let now = new Date().toLocaleString();
        if (!allTasks[activeCallIndex].callHistory) {
            allTasks[activeCallIndex].callHistory = [];
        }
        allTasks[activeCallIndex].callHistory.push(now); // stored only in localStorage
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }
    closeCallModal();
});

// ===== ATTACH EVENTS =====
function attachMessageEvents() {
    document.querySelectorAll(".message-btn").forEach((btn, idx) => {
        btn.onclick = () => openMessageModal(idx);
    });
}

function attachCallEvents() {
    document.querySelectorAll(".call-btn").forEach((btn, idx) => {
        btn.onclick = () => openCallModal(idx);
    });
}

// ===== MODIFY showCards TO REATTACH EVENTS =====
const originalShowCards = showCards;
showCards = function() {
    originalShowCards();
    attachMessageEvents();
    attachCallEvents();
};

// Initial attach
showCards();
attachMessageEvents();
attachCallEvents();
