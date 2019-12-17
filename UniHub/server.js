const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//Database Options.
const dbOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
};

//Database Connection.
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, dbOpts)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

//Frontend Access Control.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//Request Body Parser.
app.use(express.json());

//API Routes.
app.use("/api/auth", require("./routes/router.auth"));
app.use("/api/student", require("./routes/router.student"));
app.use("/api/admin", require("./routes/router.admin"));
app.use("/api/course", require("./routes/router.course"));
app.use("/api/instructor", require("./routes/router.instructor"));
app.use("/api/assignment", require("./routes/router.assignment"));
app.use("/api/solution", require("./routes/router.solution"));
app.use("/api/notification", require("./routes/router.notification"));

//Serve static in production
if (process.env.NODE_ENV === "production") {

    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });

}

const PORT = process.env.PORT || 5000;

app.listen(PORT, err => err ? console.log(err) : console.log(`Server is listening to port ${PORT}`));
