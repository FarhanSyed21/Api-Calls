import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titles, setTitles] = useState("");
  const [openingTexts, setOpeningTexts] = useState("");
  const [releaseDates, setReleaseDates] = useState("");

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Title:", titles);
    console.log("Opening Text:", openingTexts);
    console.log("Release Date:", releaseDates);

    setTitles("");
    setOpeningTexts("");
    setReleaseDates("");
  };

  return (
    <React.Fragment>
      <section>
        <form onSubmit={submitHandler}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={titles}
            onChange={(e) => setTitles(e.target.value)}
            className="title"
          />
          <label htmlFor="openingText">Opening Text</label>
          <input
            type="text"
            name="openingText"
            value={openingTexts}
            onChange={(e) => setOpeningTexts(e.target.value)}
            className="openingText"
          />
          <label htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={releaseDates}
            onChange={(e) => setReleaseDates(e.target.value)}
            className="releaseDate"
          />
          <button type="submit">Add Movie</button>
        </form>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found No Movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>...Loading</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
