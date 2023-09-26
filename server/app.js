const express = require('express');
const bodyParser = require('body-parser');
const { initDatabase } = require('./database');
const collectionRoutes = require('./routes/collection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Initialize the database
initDatabase();

// Route requests to collections
app.use('/collection', collectionRoutes);

const server = app.listen(PORT, () => {
    const address = server.address();
  console.log(`Server is running on port ${PORT}`);
});


module.exports = { app, server }; // Export both app and server
