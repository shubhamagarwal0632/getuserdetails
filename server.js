const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
// app.use(cors());



const app = express();


app.use(cors({
  origin: '*', // Replace '*' with specific allowed origins if necessary
  methods: ['GET', 'POST']
}));

// MongoDB connection string
const mongoURI = 'mongodb+srv://allinone1creater:yZcMFEN7xScca50R@webdevmastry.qdmg1eg.mongodb.net/';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  budget: { type: Number, required: true },
  whyHere: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('uservalueforthedatacheck', userSchema);

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create API endpoint
app.post('/createUser', upload.none(), async (req, res) => {
  const { firstName, email, budget, whyHere } = req.body;

  if (!firstName || !email || budget == null || !whyHere) {
    return res.status(400).json({ message: 'All fields are required: firstName, email, budget, whyHere' });
  }

  try {
    const newUser = new User({ firstName, email, budget, whyHere });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error });
    }
  }
});

// Get all users
app.get('/getdata', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the collection
    res.status(200).json(users); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
