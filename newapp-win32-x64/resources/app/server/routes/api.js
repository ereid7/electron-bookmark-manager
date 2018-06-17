const express = require('express');

const router = express.Router();

// /* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
  console.log('api works');
});

// router.post('/post', (req, res) => {
//     console.log('api works');
// });

// -------------------------------------------------------------------------------

// DATABASE

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'path/to/datafile', autoload: true });


var doc = {
    name: 'Reddit',
    url: 'www.reddit.com',
    category: 'home'
}

db.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});

router.post('/post', (req, res) => {
  console.log('api works');
  obj = db.find({ category: 'home' }, function (err, docs) {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });

  JSON.stringify(obj);
  res.send(obj);
});

module.exports = router;


