// Username generation logic
document.addEventListener("DOMContentLoaded", function () {
    const generateUsernameBtn = document.getElementById("generateUsername");
    const signupUsernameInput = document.getElementById("signupUsername");

    if (generateUsernameBtn) {
        generateUsernameBtn.addEventListener("click", function () {
            const adjectives = [
                "Cool", "Mysterious", "Brave", "Quick", "Clever", "Silent", "Swift", "Fierce", "Epic", "Fearless",
                "Witty", "Shadowy", "Vivid", "Thunderous", "Electric", "Daring", "Cunning", "Stealthy", "Bold",
                "Savage", "Phantom", "Stormy", "Glitchy", "Cosmic", "Reckless", "Blazing", "Evasive", "Chill",
                "Frosty", "Infinite", "Radiant", "Wandering", "Dynamic", "Legendary", "Lunar", "Nebula", "Celestial"
            ];

            const nouns = [
                "Panda", "Shadow", "Fox", "Hawk", "Wizard", "Ninja", "Ranger", "Knight", "Samurai", "Phantom",
                "Vortex", "Titan", "Hunter", "Nomad", "Specter", "Dragon", "Wolf", "Falcon", "Sphinx", "Jester",
                "Phoenix", "Gladiator", "Ronin", "Comet", "Dagger", "Cipher", "Bolt", "Panther", "Crimson",
                "Viper", "Spartan", "Rogue", "Blizzard", "Sentinel", "Voyager", "Astronaut", "Maverick"
            ];

            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
            const randomNumber = Math.floor(Math.random() * 1000);

            const randomUsername = `${randomAdjective}${randomNoun}${randomNumber}`;
            signupUsernameInput.value = randomUsername;
        });
    }
});

// Sign-up logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessage = document.getElementById('signupError');

        // Password validation conditions
        const passwordLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // Check if password matches the confirm password
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            return;
        }

        // Check password strength
        if (!passwordLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            errorMessage.textContent = 'Password must meet the following conditions:\n' +
                '- At least 8 characters\n' +
                '- At least one uppercase letter\n' +
                '- At least one lowercase letter\n' +
                '- At least one number\n' +
                '- At least one special character (e.g., !@#$%^&*)';
            return;
        }

        // If all conditions are met, save the password
        localStorage.setItem('user_' + username, password);
        alert('Sign-up successful!');
        window.location.href = 'login.html';
    });
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        if (localStorage.getItem('user_' + username) === password) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'welcome.html';
        } else {
            alert("Invalid credentials!");
        }
    });
}

// Camera recording logic
const cameraPreview = document.getElementById('cameraPreview');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const mediaList = document.getElementById('mediaList');

let mediaRecorder;
let recordedChunks = [];
let userLocation = "Location not available";

// Initialize camera and load saved videos
async function initialize() {
    console.log("Initializing...");
    await startCamera();
    getLocation();
    loadSavedVideos();
}

// Start camera preview
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        cameraPreview.srcObject = stream;
        cameraPreview.play();

        const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
            ? 'video/webm; codecs=vp9'
            : 'video/webm';

        mediaRecorder = new MediaRecorder(stream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = saveRecording;

        startRecordingButton.addEventListener('click', () => mediaRecorder.start());
        stopRecordingButton.addEventListener('click', () => mediaRecorder.stop());

    } catch (error) {
        alert('Error accessing camera: ' + error.message);
        console.error('Camera error:', error);
    }
}

// Get user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
        }, (error) => {
            console.error('Error getting location:', error);
            userLocation = "Location not available";
        });
    } else {
        userLocation = "Geolocation not supported";
    }
}

// Save the recording and store it in local storage
function saveRecording() {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(videoBlob);
    displayRecordedMedia(videoURL);

    // Convert Blob to Base64 and store it in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Data = reader.result;
        saveToLocalStorage(base64Data);
    };
    reader.readAsDataURL(videoBlob);

    recordedChunks = [];
}

// Save video data to localStorage
function saveToLocalStorage(base64Data) {
    const savedVideos = JSON.parse(localStorage.getItem('recordedVideos')) || [];
    savedVideos.push(base64Data);
    localStorage.setItem('recordedVideos', JSON.stringify(savedVideos));
    console.log("Video saved to localStorage:", savedVideos);
}

// Load saved videos from localStorage
function loadSavedVideos() {
    const savedVideos = JSON.parse(localStorage.getItem('recordedVideos')) || [];
    console.log("Loading videos from localStorage:", savedVideos);

    savedVideos.forEach(videoData => displayRecordedMedia(videoData));
}

// Display recorded video with location info
function displayRecordedMedia(videoURL) {
    const container = document.createElement('div');
    const video = document.createElement('video');
    video.controls = true;
    video.src = videoURL;

    const info = document.createElement('p');
    info.innerHTML = `Location: ${userLocation}`;

    container.appendChild(video);
    container.appendChild(info);
    mediaList.appendChild(container);
}

// Initialize app
document.addEventListener("DOMContentLoaded", initialize);
