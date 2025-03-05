const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store transactions in memory (for demo)
let transactions = [];

// Function to extract amount from SMS
function extractAmountFromSMS(message) {
    // Common patterns in Indian bank SMS
    const patterns = {
        debit: /(?:spent|debited|paid|withdrawn|spent)\s+(?:INR|Rs\.?)\s*(\d+(?:\.\d{2})?)/i,
        credit: /(?:credited|received|deposited|added)\s+(?:INR|Rs\.?)\s*(\d+(?:\.\d{2})?)/i,
        amount: /(?:INR|Rs\.?)\s*(\d+(?:\.\d{2})?)/i
    };

    let amount = null;
    let type = 'expense';  // Default type

    // Check for debit
    const debitMatch = message.match(patterns.debit);
    if (debitMatch) {
        amount = parseFloat(debitMatch[1]);
        type = 'expense';
    }

    // Check for credit
    const creditMatch = message.match(patterns.credit);
    if (creditMatch) {
        amount = parseFloat(creditMatch[1]);
        type = 'income';
    }

    // If no specific pattern matched, try to find any amount
    if (!amount) {
        const amountMatch = message.match(patterns.amount);
        if (amountMatch) {
            amount = parseFloat(amountMatch[1]);
        }
    }

    return { amount, type };
}

// Endpoint to receive SMS
app.post('/sms', (req, res) => {
    const message = req.body.message;
    const { amount, type } = extractAmountFromSMS(message);

    if (amount) {
        const transaction = {
            id: Date.now(),
            amount: type === 'expense' ? -amount : amount,
            description: 'SMS Transaction',
            date: new Date().toISOString(),
            category: type
        };

        transactions.push(transaction);
        res.json({ success: true, transaction });
    } else {
        res.json({ success: false, error: 'No amount found in SMS' });
    }
});

// Get all transactions
app.get('/transactions', (req, res) => {
    res.json(transactions);
});

// Add new transaction
app.post('/transactions', (req, res) => {
    const transaction = {
        id: Date.now(),
        ...req.body
    };
    transactions.push(transaction);
    res.json(transaction);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});