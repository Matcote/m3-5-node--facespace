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
  if (currentUser.name !== undefined) {
    res.status(404).send(`you're already signed in you silly old goat`);
  } else {
    res.status(200).render("pages/signin", { currentUser: currentUser });
  }
};
const handleName = (req, res) => {
  const firstName = req.body.firstName;
  users.forEach((element) => {
    if (element.name === firstName) {
      currentUser = element;
    }
  });
  console.log(currentUser);
  if (currentUser.name === undefined) {
    res.status(404).render("pages/signin", { currentUser: currentUser });
  } else {
    res.status(200).redirect(`users/${currentUser._id}`);
  }
};

const changeFriends = (req, res) => {
  if (req.body.option === "add") {
    users[
      users.findIndex((element) => element._id === req.params.id)
    ].friends.push(currentUser._id);
    currentUser.friends.push(req.params.id);
    res.status(200).redirect(`../users/${req.params.id}`);
  } else if (req.body.option === "remove") {
    users[
      users.findIndex((element) => element._id === req.params.id)
    ].friends.splice(
      users[
        users.findIndex((element) => element._id === req.params.id)
      ].friends.findIndex((element) => element === currentUser._id),
      1
    );
    currentUser.friends.splice(
      currentUser.friends.findIndex((element) => element._id === req.params.id),
      1
    );
    res.status(200).redirect(`../users/${req.params.id}`);
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
  .post("/changefriend/:id", changeFriends)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
