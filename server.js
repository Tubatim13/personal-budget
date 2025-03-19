// Budget API - Now using MongoDB

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/myDatabase'; // Use 'myDatabase' (not 'myDataBase')
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected to myDatabase'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Budget Schema & Model (Updated to match your data structure)
const budgetSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'] 
    },
    related_value: { 
        type: Number, 
        required: [true, 'Related value is required'],
        min: [0, 'Budget value cannot be negative']
    },
    color: { 
        type: String, 
        required: [true, 'Color is required'],
        match: [/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid 6-digit hexadecimal format (e.g., #ED4523)']
    }
});
const Budget = mongoose.model('Budget', budgetSchema, 'myCollection'); // Updated to match your collection name

// Endpoint 1: Fetch budget data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find({}).exec(); // Ensure a proper query execution
        console.log("Fetched data:", budgetData); // Debugging output
        res.json({ myBudget: budgetData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Error fetching data from the database' });
    }
});

// Endpoint 2: Add a new budget entry to MongoDB
app.post('/budget', async (req, res) => {
    try {
        const { title, related_value, color } = req.body;

        // Check if all fields exist
        if (!title || !related_value || !color) {
            return res.status(400).json({ error: 'All fields (title, related_value, color) are required' });
        }

        // Create and save the new entry
        const newBudget = new Budget({ title, related_value, color });
        await newBudget.save();
        
        res.status(201).json({ message: 'New budget entry added successfully', data: newBudget });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error adding data to the database' });
    }
});

// Serve static files from 'public' folder
app.use('/', express.static('public'));

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
