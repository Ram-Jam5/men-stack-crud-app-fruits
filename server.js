const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan")

const app = express();


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to Mongo DB ${mongoose.connection.name}.`);
});
const Fruit = require("./models/fruit.js");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: allFruits })
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.get('/fruits/:fruitId', async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit })
})

// GET /fruits/:fruitID
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});


app.put('/fruits/:fruitId', async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
  res.redirect(`/fruits/${req.params.fruitId}`)
})

// POST /fruits/new
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    try {
      if (!req.body.name.trim()) {
        throw new Error("Invalid input: The name field cannot be empty!");
      }
      await Fruit.create(req.body);
      res.redirect("/fruits");
    } catch (err) {
      res.render("fruits/new.ejs", { errorMessage: err.message });
    }  
});

app.delete('/fruits/:fruitId', async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits")
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
