const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { movies } = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genress endpoint:
   This endpoint returns a sorted array of all the genress of the movies
   that are currently in the movie model.
*/
app.get('/genres', (req, res) => {
  const genres = [
    ...new Set(
      Object.values(movies).flatMap(movie => movie.Genres)
    )
  ].sort();

  res.json(genres);
});


/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  let movieList = Object.values(movies);
  const genre = req.query.genre;

  if (genre) {
    movieList = movieList.filter(function (movie) {
      return movie.Genres.includes(genre);
    });
  }

  res.send(movieList);
});


// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movies
 
  if (exists) {
    res.send(movies[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movies

  movies[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on [localhost](http://localhost:3000/)")
