// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Import file system module

const app = express();
const port = 3000;
const budgetData = JSON.parse(fs.readFileSync('budget_data.json', 'utf8'));
const myBudget = budgetData.myBudget;

app.use(cors());

app.use('/', express.static('public'));

app.get('/budget', (req, res) => {
    res.json({ myBudget });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});