const Clarifai = require('clarifai');

// clarifai configuration
const app = new Clarifai.App({
  apiKey: 'aacd3f1655ef493a87d4b824b20683f3' // key example
}); 

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unabel to work with api'));
}

const handleImage = (req, res, db) => {
  const {id} = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
  handleImage,
  handleApiCall
};