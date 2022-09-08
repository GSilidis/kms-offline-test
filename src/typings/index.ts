interface Movie {
  id: number,
  title: string,
  year: number,
  genres: Array<string>,
  description: string,
  cover: string,
}

interface MovieShort {
  id: number,
  title: string,
}

export { Movie, MovieShort };
