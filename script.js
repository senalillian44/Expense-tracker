const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Get transactions from localStorage
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null
    ? localStorageTransactions
    : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add an expense and amount");
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionToDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Add transaction to DOM
function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text}
    <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update balance, income, and expenses
function updateValues() {
  const amounts = transactions.map(
    transaction => transaction.amount
  );

  const total = amounts
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expense = (
    amounts
      .filter(item => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter(
    transaction => transaction.id !== id
  );

  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

// Initialize app
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionToDOM);
  updateValues();
}

init();

// Generate random ID
function generateId() {
  return Math.floor(Math.random() * 100000000);
}

// Event listener
form.addEventListener("submit", addTransaction);