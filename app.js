
function generateUsername() {
    const adjectives = ['Brave', 'Kind', 'Calm', 'Swift'];
    const nouns = ['Tiger', 'Moon', 'River', 'Sky'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    document.getElementById('username').value = randomAdj + randomNoun + Math.floor(Math.random() * 1000);
}

function handleSignUp(event) {
    event.preventDefault();
    alert('Sign Up Successful! Redirecting to Log In...');
    window.location.href = 'login.html';
}

function handleLogin(event) {
    event.preventDefault();
    alert('Log In Successful! Redirecting to Dashboard...');
    window.location.href = 'welcome.html';
}

function searchEntries() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    alert('Searching for: ' + query);
}

function submitComplaint(event) {
    event.preventDefault();
    alert('Complaint submitted!');
}

function submitExperience(event) {
    event.preventDefault();
    alert('Experience shared!');
}
    