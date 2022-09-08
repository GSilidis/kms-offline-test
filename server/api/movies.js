import data from '../data/movies.json' assert {type: 'json'};
import express from 'express';

const movies = express();

movies.get('/', (req, res) => {
  res.json(data.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
    };
  }));
});

movies.get('/cache.json', (req, res) => {
  res.json(data);
});

movies.get('/:id', (req, res, next) => {
  const paramId = Number(req.params.id);

  if (isNaN(paramId)) {
    return res.status(403).json({ status: 'ID is NaN' });
  }

  const movie = data.find((movie) => {
    return paramId === movie.id;
  });

  if (!movie) {
    return next();
  } else {
    res.json(movie);
  }
});

export default movies;
