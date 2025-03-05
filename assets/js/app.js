class BudgetTracker {
    constructor() {
        this.transactions = [];
        this.initializeEventListeners();
        this.loadTransactions();
    }

    initializeEventListeners() {
        const form = document.getElementById('transaction-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    async loadTransactions() {
        try {
            const response = await fetch('http://localhost:3000/transactions');
            const data = await response.json();
            this.transactions = data;
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    async addTransaction() {
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const transaction = {
            amount: category === 'income' ? +amount : -amount,
            description,
            category,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (response.ok) {
                const savedTransaction = await response.json();
                this.transactions.push(savedTransaction);
                this.updateDisplay();
                document.getElementById('transaction-form').reset();
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    }

    // Function to process SMS
    async processSMS(message) {
        try {
            const response = await fetch('http://localhost:3000/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.transactions.push(result.transaction);
                    this.updateDisplay();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error processing SMS:', error);
            return false;
        }
    }

    updateDisplay() {
        const transactionList = document.getElementById('transaction-list');
        const totalBalance = document.getElementById('total-balance');
        
        // Clear current list
        transactionList.innerHTML = '';
        
        // Calculate total
        const total = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        totalBalance.textContent = `₹${total.toFixed(2)}`;
        
        // Display transactions
        this.transactions.forEach(t => {
            const div = document.createElement('div');
            div.className = 'transaction-item';
            
            div.innerHTML = `
                <div>
                    <strong>${t.description}</strong>
                    <br>
                    <small>${new Date(t.date).toLocaleDateString()}</small>
                </div>
                <div style="color: ${t.amount > 0 ? 'green' : 'red'}">
                    ${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount).toFixed(2)}
                </div>
            `;
            
            transactionList.appendChild(div);
        });
    }
}

// Initialize the app
const budgetTracker = new BudgetTracker();

// Add a test button for SMS processing
const testButton = document.createElement('button');
testButton.textContent = 'Test SMS Processing';
testButton.onclick = () => {
    const testSMS = "Your a/c XX1234 is debited for Rs.500 on 10/02 at SHOP";
    budgetTracker.processSMS(testSMS);
};
document.querySelector('.container').appendChild(testButton);
// Add sidebar navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Add active class to clicked nav item
        this.classList.add('active');
    });
});