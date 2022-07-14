// Package imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRouter = require('./routes/auth');
// Local imports
// Initializations
const PORT = 3000;
// Replacde with your mongodb database connection link
const DB = '';
// middle ware for auth
app.use(express.json());
app.use(cors());

app.use(authRouter);

// Init 
mongoose.connect(DB, () => {
    console.log('connection successful');
}).then().catch(e => { console.log(e) });


app.listen(PORT, '0.0.0.0', () => {
    console.log(`listening on port ${PORT}`);
});
