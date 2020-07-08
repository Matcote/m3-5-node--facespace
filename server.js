"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};
const handleProfilePage = (req, res) => {
  res.status(200).render("pages/profile", {
    user: users[req.params.id - 1006],
    users: users,
  });
};
const handleSignin = (req, res) => {
  res.status(200).render("pages/signin");
};
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  const user = users.find((element) => element.name === firstName);
  console.log(user);
  if (user === undefined) {
    res.status(404).render("pages/signin");
  } else {
    res.status(200).redirect(`users/${user._id}`);
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:id", handleProfilePage)
  .get("/signin", handleSignin)
  .post("/getname", handleName)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
