const express = require('express');
const router = express.Router();
const Fruit = require('../models/fruit');

// Seed Route
router.get('/seed', async (req, res) => {
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
router.get('/', async (req, res) => {
  console.log('Index Controller Func. running...');
  try {
    const foundFruit = await Fruit.find({});
    res.status(200).render('fruits/Index', { fruits: foundFruit });
  } catch (err) {
    res.status(400).send(err);
  }
});

// New // renders a form to create a new fruit
router.get('/new', (req, res) => {
  res.render('fruits/New');
});

// Delete // recieves the id of the fruit document and deletes it, after that it will redirect back to the Index.
router.delete('/:id', async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id); // grabbing _id from params, it is given value on the Index.jsx page (ln. 29(template literal))
    res.status(200).redirect('/fruits');
  } catch (err) {
    res.status(400).send(err);
  }
});

//Update/PUT
router.put('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.get('/:id/edit', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

module.exports = router;
