// FileName: index.js
// Import express
let express = require("express");
// Initialize the app
let app = express();
const mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/notes")
//mongoose.connect("mongodb://127.0.0.1/notes")
mongoose
  .connect(
    "mongodb+srv://ilovecheese:yesido@cluster0.cuscu61.mongodb.net/?retryWrites=true&w=majority",
    {
     useNewUrlParser: true,
   }
  )
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const noteRouter = require("./routes/note");
app.use("/api", noteRouter);
// Setup server port
const PORT = process.env.PORT || 3000;
// Send message for default URL
app.get("/", (req, res) => res.send("Hello World with Express@"));
// Launch app to listen to specified port
app.listen(PORT, function () {
  console.log("Running backend on port " + PORT);
});

module.exports = app;
