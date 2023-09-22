const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give pass as an argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://imtinanfarooq:${password}@cluster0.vfvs7gu.mongodb.net/phoneBook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    const personSchema = new mongoose.Schema({
      content: String,
      number: Number,
    });

    const Person = mongoose.model("Person", personSchema);

    const name = process.argv[3];
    const num = process.argv[4];

    if(process.argv.length > 3){
        const person = new Person({
            content: name,
            number: num,
          });
      
          person.save().then((result) => {
            console.log(`added ${name} number ${num} to phonebook`);
            mongoose.connection.close();
          });
    }

    if (process.argv.length === 3) {
      Person.find({})
        .then((persons) => {
          console.log("Phonebook:");
          persons.forEach((person) => {
            console.log(person.content, person.number);
          });
        })
        
        .finally(() => {
          mongoose.connection.close();
        });
    }
  });
