function getUsers() {
    fetch("https://randomuser.me/api/?results=3")
    .then(raw => raw.json())
    .then(data => {
        document.querySelector(".users").innerHTML = ""; // Clear previous users
        data.results.forEach(user => {

            // Main container
            const card = document.createElement("div");
            card.className = "bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full";

            // Inner flex container
            const innerDiv = document.createElement("div");
            innerDiv.className = "flex flex-col items-center";

            // Image
            const img = document.createElement("img");
            img.className = "w-24 h-24 rounded-full mb-4";
            img.src = user.picture.large;
            img.alt = "User Avatar";

            // Name
            const name = document.createElement("h2");
            name.className = "text-xl font-semibold mb-1 text-white";
            name.textContent = user.name.first + " " + user.name.last;

            // Email
            const email = document.createElement("p");
            email.className = "text-gray-400 mb-2";
            email.textContent = user.email;

            // Status badge
            const status = document.createElement("span");
            status.className = "inline-block bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded";
            status.textContent = "Active User";

            // Append all elements
            innerDiv.appendChild(img);
            innerDiv.appendChild(name);
            innerDiv.appendChild(email);
            innerDiv.appendChild(status);

            card.appendChild(innerDiv);

            // Finally append card to body or any container
            document.querySelector(".users").appendChild(card);

        });
    });
}


getUsers();

document.querySelector("#refreshBtn").addEventListener("click", () => {
    getUsers();
});