const express = require('express');
const keys = require('./config/keys');
const app = express();
const path = require('path');
const cors = require('cors');

// Database Connection
const connectDB = require('./config/connectDB');
connectDB();

// SET Port 
const PORT = process.env.PORT || keys.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/render'));
app.use('/api/files', require('./routes/file'));
app.use('/files', require('./routes/file'));
app.use('/delete', require('./routes/deleteData'));
app.get('/checkserver', (req, res) => res.json({success: "Server is running..."}));

// Server Start
app.listen(PORT, () => {
    console.log('Server Running...');
});