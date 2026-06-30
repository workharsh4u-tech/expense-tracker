// ==============================
// GET HTML ELEMENTS
// ==============================

let form = document.getElementById("transactionForm");
let label = document.getElementById("label");
let amount = document.getElementById("amount");
let type = document.getElementById("type");
let category = document.getElementById("category");

let transactionList = document.getElementById("transactionList");
let emptyState = document.getElementById("emptyState");

let search = document.getElementById("search");
let filter = document.getElementById("filter");

let transactions = [];


// ==============================
// LOAD DATA
// ==============================

function loadTransactions() {

    let storedData = localStorage.getItem("transactions");

    if (storedData != null) {

        transactions = JSON.parse(storedData);

    }

}


// ==============================
// SAVE DATA
// ==============================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ==============================
// DISPLAY TRANSACTIONS
// ==============================

function displayTransactions() {

    transactionList.innerHTML = "";

    let searchText = search.value.toLowerCase();

    let filterType = filter.value;

    let filteredTransactions = transactions.filter(function (transaction) {

        let matchSearch =
            transaction.label.toLowerCase().includes(searchText);

        let matchFilter =
            filterType == "All" || transaction.type == filterType;

        return matchSearch && matchFilter;

    });


    if (filteredTransactions.length == 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";


    filteredTransactions.forEach(function (transaction) {

        let index = transactions.indexOf(transaction);

        let card = document.createElement("div");

        card.className = "transaction";

        card.innerHTML = `

        <div class="left">

            <span class="label">

                ${transaction.label}

            </span>

            <span class="category">

                ${transaction.category}

            </span>

            <small>

                ${transaction.date} | ${transaction.time}

            </small>

        </div>

        <div class="right">

            <span class="amount ${transaction.type.toLowerCase()}">

                ${transaction.type == "Income" ? "+" : "-"} ₹${transaction.amount}

            </span>

            <button
                class="delete-btn"
                onclick="deleteTransaction(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        transactionList.appendChild(card);

    });

}

// ==============================
// UPDATE SUMMARY
// ==============================

function updateSummary() {

    let income = transactions
        .filter(function(transaction){
            return transaction.type == "Income";
        })
        .reduce(function(total, transaction){
            return total + transaction.amount;
        },0);


    let expense = transactions
        .filter(function(transaction){
            return transaction.type == "Expense";
        })
        .reduce(function(total, transaction){
            return total + transaction.amount;
        },0);


    let balance = income - expense;


    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + expense;
    document.getElementById("balance").innerText = "₹" + balance;

    document.getElementById("transactionCount").innerText =
        "Total : " + transactions.length;


    let balanceText = document.getElementById("balance");

    if(balance >= 0){

        balanceText.style.color = "green";

    }
    else{

        balanceText.style.color = "red";

    }

}



// ==============================
// ADD TRANSACTION
// ==============================

form.addEventListener("submit", function(event){

    event.preventDefault();


    if(label.value.trim() == ""){

        alert("Please enter transaction label.");
        return;

    }


    if(amount.value <= 0){

        alert("Amount should be greater than 0.");
        return;

    }


    let transaction = {

        label : label.value,

        amount : Number(amount.value),

        type : type.value,

        category : category.value,

        date : new Date().toLocaleDateString(),

        time : new Date().toLocaleTimeString()

    };


    // Latest transaction on top

    transactions.unshift(transaction);


    saveTransactions();

    displayTransactions();

    updateSummary();

    form.reset();

});




// ==============================
// DELETE TRANSACTION
// ==============================

function deleteTransaction(index){

    let answer = confirm("Are you sure you want to delete this transaction?");

    if(answer == false){

        return;

    }


    transactions.splice(index,1);

    saveTransactions();

    displayTransactions();

    updateSummary();

}




// ==============================
// SEARCH
// ==============================

search.addEventListener("keyup", function(){

    displayTransactions();

});




// ==============================
// FILTER
// ==============================

filter.addEventListener("change", function(){

    displayTransactions();

});




// ==============================
// START APPLICATION
// ==============================

loadTransactions();

displayTransactions();

updateSummary();