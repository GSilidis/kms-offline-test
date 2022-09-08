import express from 'express';
import cors from 'cors';

import movies from './api/movies.js';

const app = express();
const port = 3000;

app.use(cors());
app.use('/api/movies', movies);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

