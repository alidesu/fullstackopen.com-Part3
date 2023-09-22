require('dotenv').config()
const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
const path = require("path");

const Person = require('./models/note')
app.use(express.static(path.join(__dirname, "dist")));

const customFormat = (tokens, req, res) => {
  return console.log(req.body);
};
app.use(morgan("dev"));
app.use(morgan(customFormat));

// const PORT = process.env.PORT || 3006;


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => { // Change 'notes' to 'persons'
      response.json(persons);
    })
    .catch(error => {
      next(error)
    });
});


app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch(error => {
      next(error)
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error)
    });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({
    name: body.name,   // Use 'body.name' for the 'name' field
    number: body.number, // Use 'body.number' for the 'number' field
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      next(error)
      console.log("NEW ERROR THROWN: ",error.message)
      
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const updateData = req.body; // Assuming you send the updated data in the request body
  const { content, important } = req.body
  // Validate the updateData as needed

  Person.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch(error => {
      next(error)
    });
});


const errorHandler = (error, request, response, next) => {
  console.log("Error: ",error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  console.error(error)
  return next(error)
}

app.use(errorHandler)

const PORT = 3006
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

