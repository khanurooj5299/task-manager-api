require("dotenv").config(); //this line should be at top so that for any module the environment variables are available
const connection = require("./utilities/connection"); //to connect to the DB

//Application will start only when connection to DB is succesfull
connection.connect
  .then(() => {
    //--------MAIN APPLICATION LOGIC---------
    const express = require("express");
    const cors = require("cors");

    const app = express();
    const PORT = process.env.PORT | 3000;
    const taskRouter = require("./routers/task.router");
    const session = require("express-session");

    //register middleware
    //session middleware is required for count API
    app.use(express.json());
    app.use(cors());
    app.use(
      session({
        secret: process.env.SECRET_KEY || "my key",
        resave: false,
        saveUninitialized: false,
      })
    );

    //register paths
    app.use("/task", taskRouter);
    //Wildcard path for catching ecverything that didn't match
    app.use("*", (req, res) => {
      throw new Error(404);
    });

    //Register centralized error handling middleware
    app.use((err, req, res, next) => {
      //if next(err) is called after we have started writing response, we fallback to default express error handler
      if (res.headersSent) {
        return next(err);
      }
      if (err.message == 404) {
        res.status(404).send("Nothing here");
      } else if (err.status == 400) {
        res.status(400).send(err.message || "Bad request");
      } else {
        console.dir(err.message || err);
        res.status(500).send("Something went wrong!");
      }
    });

    //Start server
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.log("Could not start application");
    console.log(err);
  });
