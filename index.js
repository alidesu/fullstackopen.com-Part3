let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(express.static("dist"));
const cors = require("cors");
app.use(cors());

const customFormat = (tokens, req, res) => {
  return console.log(req.body);
};
app.use(morgan("dev"));
app.use(morgan(customFormat));

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server is now live on ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("HEllO");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const noOfIds = Math.max(...persons.map((names) => names.id));

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has in for for ${noOfIds} people <br /> ${new Date()}<p/>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((per) => per.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((per) => per.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }
  if (persons.some((person) => person.name === body.name)) {
    return res
      .status(400)
      .json({ error: "Name is already present in the phonebook" });
  }

  const randomNum = Math.floor(Math.random() * 1000);
  const person = {
    id: randomNum,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(persons);
});
