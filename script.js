// Initialize player's balance and admin's earnings
let balance = 0;
let webAdminBalance = 0; // Admin's earnings

// Array representing a simple deck of cards
const deck = [
    "♠️ A", "♠️ 2", "♠️ 3", "♠️ 4", "♠️ 5", "♠️ 6", "♠️ 7", "♠️ 8", "♠️ 9", "♠️ 10", "♠️ J", "♠️ Q", "♠️ K",
    "♥️ A", "♥️ 2", "♥️ 3", "♥️ 4", "♥️ 5", "♥️ 6", "♥️ 7", "♥️ 8", "♥️ 9", "♥️ 10", "♥️ J", "♥️ Q", "♥️ K",
    "♦️ A", "♦️ 2", "♦️ 3", "♦️ 4", "♦️ 5", "♦️ 6", "♦️ 7", "♦️ 8", "♦️ 9", "♦️ 10", "♦️ J", "♦️ Q", "♦️ K",
    "♣️ A", "♣️ 2", "♣️ 3", "♣️ 4", "♣️ 5", "♣️ 6", "♣️ 7", "♣️ 8", "♣️ 9", "♣️ 10", "♣️ J", "♣️ Q", "♣️ K"
];

// Track the current bet and side
let currentBetAmount = 0;
let selectedSide = '';

// Update the balance display
function updateBalance() {
    document.getElementById('balance').textContent = `Balance: $${balance.toFixed(2)}`;
}

// Function to deposit money
document.getElementById('deposit-btn').addEventListener('click', function () {
    const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
    if (depositAmount > 0) {
        balance += depositAmount;
        updateBalance();
        document.getElementById('deposit-amount').value = ''; // Clear input
    } else {
        alert("Please enter a valid deposit amount.");
    }
});

// Handle placing bets
document.getElementById('bet-btn').addEventListener('click', function () {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    const betSide = document.querySelector('input[name="side"]:checked');

    if (!betSide) {
        alert("Please choose either Player or Banker to bet on!");
        return;
    }

    if (betAmount > 0 && betAmount <= balance) {
        currentBetAmount = betAmount;
        selectedSide = betSide.value;

        // Deduct bet amount from balance immediately
        balance -= betAmount;
        updateBalance();

        // Enable the Draw Cards button
        document.getElementById('draw-btn').disabled = false;
        document.getElementById('game-result').textContent = ''; // Clear previous results
    } else {
        alert("Please enter a valid bet amount that is less than or equal to your balance.");
    }
});

// Handle card draw
document.getElementById('draw-btn').addEventListener('click', function () {
    // Draw cards for player and banker
    const playerCard = drawCard();
    const bankerCard = drawCard();

    // Determine card values
    const playerCardValue = getCardValue(playerCard);
    const bankerCardValue = getCardValue(bankerCard);

    // Display drawn cards
    document.getElementById('player-card').textContent = `Player's Card: ${playerCard}`;
    document.getElementById('banker-card').textContent = `Banker's Card: ${bankerCard}`;

    // Determine the winner
    let winner = '';
    let prize = 0;

    if ((selectedSide === 'player' && playerCardValue > bankerCardValue) ||
        (selectedSide === 'banker' && bankerCardValue > playerCardValue)) {
        winner = 'You win!';
        prize = currentBetAmount * 2 * (1 - 0.0314); // Double the bet minus 3.14% tax
        balance += prize; // Add the reward to balance
        webAdminBalance += currentBetAmount * 2 * 0.0314; // Admin earns tax
    } else if (playerCardValue === bankerCardValue) {
        winner = 'It’s a tie! Your bet has been returned.';
        balance += currentBetAmount; // Return the bet amount
    } else {
        winner = 'You lose!';
        // Bet amount is already deducted
    }

    updateBalance();

    // Display the result
    document.getElementById('game-result').textContent = `${winner} Your balance is now $${balance.toFixed(2)}.`;

    // Disable the Draw button if balance is too low
    if (balance <= 0) {
        alert("You're out of balance! Please deposit more to continue playing.");
        document.getElementById('draw-btn').disabled = true;
    }

    // Reset bet for next round
    resetBetting();
});

// Helper function to draw a random card
function drawCard() {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
}

// Helper function to get the value of a card
function getCardValue(card) {
    const value = card.split(' ')[1];
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
}

// Reset betting for the next round
function resetBetting() {
    document.getElementById('bet-amount').value = '';
    document.querySelectorAll('input[name="side"]').forEach(input => input.checked = false);
    document.getElementById('draw-btn').disabled = true;
}

// Enable "Enter" key for buttons
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'deposit-amount') {
            document.getElementById('deposit-btn').click();
        } else if (activeElement.id === 'bet-amount') {
            document.getElementById('bet-btn').click();
        }
    }
});
