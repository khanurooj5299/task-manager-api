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
    app.set('trust proxy', 1); //to enable secure:true cookies after deployment
    app.use(
      cors({
        /*this config object is set because on the frontend fetch api is used which requires credentials: 'include' option
        for sending and recieving cookies from cross origin servers. But when that option is set, in the response
        wildcard cannot be used for Access-Control-Allow-Origin header and Access-Control-Allow-Credentials header should be true. 
        Hence we put the current requests origin there and set the other header mentioned to true to make both cors and cookie work*/
        // origin: function (origin, callback) {
        //   // Allow requests from any origin
        //   callback(null, origin);
        // },
        //for production only allow the deployed frontend domain
        origin: "https://task-manager-c2f3.onrender.com",
        credentials: true,
      })
    );
    app.use(
      session({
        secret: process.env.SECRET_KEY || "my key",
        resave: false,
        saveUninitialized: true,
        cookie: {
          //set to false so that cookie will be set even if connection is not over https. important for local development
          // secure: false,
          //for production
          secure: true,
          //so that the session management cookie becomes a session cookie. When browser is closed the cookie will be cleared from the browser
          maxAge: null,
          //so that browser will send the cookie back even though it will be a cross-site request
          sameSite: "none"
        },
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
