document.addEventListener("DOMContentLoaded", function () {
    const usernameElement = document.getElementById("username");
    const bioElement = document.getElementById("bio");

    const currentUser = localStorage.getItem("currentUser");

    // If the user is not logged in, redirect to login page
    if (!currentUser) {
        alert("Please log in to view your profile.");
        window.location.href = "login.html";
    } else {
        // Set the username
        usernameElement.textContent = currentUser;

        // Load the user's bio from localStorage (if available)
        const userBio = localStorage.getItem(`${currentUser}_bio`);
        bioElement.value = userBio || "";

        // Load the user's profile picture (if available)
        const userProfilePic = localStorage.getItem(`${currentUser}_profilePic`);
        if (userProfilePic) {
            profilePicElement.src = userProfilePic;
        }
    }
});
