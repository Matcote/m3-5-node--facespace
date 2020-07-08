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
  console.log(currentUser);
  res
    .status(200)
    .render("pages/homepage", { users: users, currentUser: currentUser });
};
const handleProfilePage = (req, res) => {
  res.status(200).render("pages/profile", {
    user: users[users.findIndex((element) => element._id === req.params.id)],
    users: users,
    currentUser: currentUser,
  });
};
const handleSignin = (req, res) => {
  res.status(200).render("pages/signin", { currentUser: currentUser });
};
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  currentUser = users.find((element) => element.name === firstName);
  if (currentUser === undefined) {
    res.status(404).render("pages/signin", { currentUser: currentUser });
  } else {
    res.status(200).redirect(`users/${currentUser._id}`);
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
