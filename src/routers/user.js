const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const Task = require("../models/task");
//todo const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("It must be of type jpg, jpeg or png"));
    }
    cb(undefined, true);
  },
});

router.post("/users", upload.single("avatar"), async (req, res) => {
  const buffer = await sharp(req.file.buffer) .resize({ width: 250, height: 250 }).png().toBuffer();
  req.body.avatar = buffer;
  const user = new User(req.body);
  try {
    await user.save();
    // todo sendWelcomeEmail(user.email,user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    console.log("User created");
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
    console.log("Login successful")
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((Token) => {
      return Token.token != req.token;
    });
    await req.user.save();
    res.status(200).send();
    console.log("Logout Successful")
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, upload.single("avatar"), async (req, res) => {
  if(req.file){
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
  }
  const updates = Object.keys(req.body);
  const allowed = ["name", "age", "email", "password", "avatar"];
  const isvalid = updates.every((update) => allowed.includes(update));
  if (!isvalid) {
    return res.status(400).send({ error: "Invalid values" });
  }
  try {
    //const user = await User.findByIdAndUpdate(req.user._id)
    // updates.forEach((update) => (req.user[update] = req.body[update]));
    const user = await User.findByIdAndUpdate(req.user._id,req.body,{new:true, runValidators:true})
    await req.user.save();
    res.status(200).send(user);
    console.log("User updated!")
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id)

    const userTask = await Task.findByIdAndDelete({owner:req.user._id})
    
     if(!user){
        return res.status(404).send()
     }
    // await req.user.remove();
    // todo sendCancelationEmail(user.email,user.name)
    res.status(200).send(req.user);
    console.log("User Deleted succesfully")
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
  console.log("Avatar removed")
});

module.exports = router;
