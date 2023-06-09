require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const Fruit = require('./models/fruit');
const { connect, connection } = require('mongoose');
const methodOverride = require('method-override');

// Database connection
connect(process.env.MONGO_URI, {
  // Having these two properties set to true is best practice when connecting to MongoDB
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// This line of code will run the function below once the connection to MongoDB has been established.
connection.once('open', () => {
  console.log('connected to mongo');
});

// View Engine Middleware Configure
const reactViewsEngine = require('jsx-view-engine').createEngine();
app.engine('jsx', reactViewsEngine);
// This line tells the render method the default file extension to look for.
app.set('view engine', 'jsx');
// This line sets the render method's default location to look for a jsx file to render. Without this line of code we would have to specific the views directory everytime we use the render method
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: false })); // This enables the req.body
//after app has been defined
//use methodOverride.  We'll be adding a query parameter to our delete form named _method
app.use(methodOverride('_method'));
app.use(express.static("public"))

// Custom Middleware
app.use((req, res, next) => {
  console.log('Middleware running...');
  next();
});

// Seed Route
app.get('/fruits/seed', async (req, res) => {
  try {
    await Fruit.create([
      {
        name: 'grapefruit',
        color: 'pink',
        readyToEat: true,
      },
      {
        name: 'grape',
        color: 'purple',
        readyToEat: false,
      },
      {
        name: 'avocado',
        color: 'green',
        readyToEat: true,
      },
    ]);
    res.redirect('/fruits');
  } catch (err) {
    res.status(400).send(err);
  }
});

// I.N.D.U.C.E.S
// ==============
// Index
app.get('/fruits', async (req, res) => {
  console.log('Index Controller Func. running...');
  try {
    const foundFruit = await Fruit.find({});
    res.status(200).render('fruits/Index', { fruits: foundFruit });
  } catch (err) {
    res.status(400).send(err);
  }
});

// New // renders a form to create a new fruit
app.get('/fruits/new', (req, res) => {
  res.render('fruits/New');
});

// Delete // recieves the id of the fruit document and deletes it, after that it will redirect back to the Index.
app.delete('/fruits/:id', async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id); // grabbing _id from params, it is given value on the Index.jsx page (ln. 29(template literal))
    res.status(200).redirect('/fruits');
  } catch (err) {
    res.status(400).send(err);
  }
});

//Update/PUT
app.put('/fruits/:id', async (req, res) => {
  try {
    req.body.readyToEat = req.body.readyToEat === 'on';
    const updatedFruit = await Fruit.findByIdAndUpdate(
      // id grabbed from the url, check ln 15 on Edit.jsx
      req.params.id,
      // Data from Edit form
      req.body,
      // Need this to prevent a delay in the update
      { new: true }
    );
    console.log(updatedFruit);
    // Redirect to that fruit's show page
    res.redirect(`/fruits/${req.params.id}`);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create // recieves info from new route to then create a new fruit w/ it
app.post('/fruits', async (req, res) => {
  try {
    req.body.readyToEat = req.body.readyToEat === 'on';
    const newFruit = await Fruit.create(req.body);
    console.log(newFruit);
    //console.log(fruits);
    // redirect is making a GET request to whatever path you specify
    res.redirect('/fruits');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Edit
app.get('/fruits/:id/edit', async (req, res) => {
  try {
    // finding the document that we are about to edit, giving the Edit.jsx the document found through props
    const foundFruit = await Fruit.findById(req.params.id);
    res.render('fruits/Edit', {
      fruit: foundFruit,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Show
app.get('/fruits/:id', async (req, res) => {
  try {
    // We are using the id given to us in the URL params to query our database.
    const foundFruit = await Fruit.findById(req.params.id);
    res.render('fruits/Show', {
      //second param must be an object
      fruit: foundFruit,
      //there will be a variable available inside the jsx file called fruit, its value is fruits[req.params.indexOfFruitsArray]
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Catch all route. If the uses try to reach a route that doesn't match the ones above it will catch them and redirect to the Index page
app.get('/*', (req, res) => {
  res.send(`
    <div>
      404 this page doesn't exist! <br />
      <a href="/fruits">Fruit</a> <br />
      <a href="/vegetables">Vegetables</a>
    </div
  `);
});

// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});