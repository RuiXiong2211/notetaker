// FileName: index.js
// Import express
require('dotenv').config()
let express = require('express')
// Initialize the app
let app = express();
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const noteRouter = require('./routes/note')
app.use('/note', noteRouter)
// Setup server port
let port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running backend on port " + port);
});