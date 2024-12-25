const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const { email, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, isAdmin },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/pizza", async (req, res) => {
  try {
    const pizza = await prisma.pizza.findMany();
    res.status(200).json(pizza);
  } catch (err) {
    res.status(400).json({ error: "Error fetching pizza" });
  }
});

app.post("/pizza", async (req, res) => {
  const { name, ingredients, price, photoName, soldOut } = req.body;

  try {
    const pizza = await prisma.pizza.create({
      data: { name, ingredients, price, photoName, soldOut },
    });
    res.status(201).json(pizza);
  } catch (err) {
    res.status(400).json({ error: "Error creating pizza" });
  }
});

app.delete("/pizza/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pizza.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Pizza deleted" });
  } catch {
    res.status(400).json({ error: "Error deleting pizza" });
  }
});

app.post("/order", async (req, res) => {
  const { userId, pizzaId, quantity } = req.body;

  try {
    const order = await prisma.order.create({
      data: { userId, pizzaId, quantity },
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: "Error placing order" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
