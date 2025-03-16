const tmdbKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTRhODc4ZDcyYzZhNWNkYTdlOTIxZmFlZGNhNDMxZSIsIm5iZiI6MTczMDMwODExMC4xNDIwMDAyLCJzdWIiOiI2NzIyNjgwZTFkZjcwZjc5MjBmZWQyYjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RZHrixpFKwanyanaD1XXkIsOwiyM7FcXMxQpNgtRvzM'
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${tmdbKey}`
  }
}; 

const getGenres = async () => {
  const url = '${tmdbBaseUrl}/genre/movie/list';  

  try {
    const response = await fetch(url, options);
    if(response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch (error) {
    console.log(error);
  };
};
  

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = '/discover/movie';
  const randomPage = Math.floor(Math.random() * 500);
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${randomPage}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movies = jsonResponse.results;
      return movies
    }
  } catch (error) {
    console.log(error);
  }

};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = '?api_key=${tmdbKey}';
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;

  try {
  const response = await fetch(urlToFetch);
  if (response.ok) {
    const jsonResponse = await response.json();
    const movieInfo = jsonResponse;
    return movieInfo;
    }
  } catch (error){
    console.log(error);
  }
};

const getCast = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}/credits`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;

  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      const castInfo = jsonResponse.cast;
      let castName = '<strong>Starring:</strong>';
      for (let i = 0; i < castInfo.length; i++){
        castName += castInfo[i].name + ', ';
      };
      return castName;
    };
  } catch(error){
    console.log(error);
  };
};

// Get Movie Ratings
const getRating = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}&language=en-US&append_to_response=release_dates`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try{
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      rating = jsonResponse.release_dates.results[0].release_dates[0].certification;
      if (rating === ''){
        return 'Not Rated';
      } else {
        return `Rated: ${rating}`;
      };
    };
  } catch(error){
    console.log(error);
  };
};

// Add movie to liked movie list(but not displayed)
const addToLikedMovies = (movieInfo) => {
  let likedMovies = '';
  likedMovies += movieInfo + (', ');
  //console.log(likedMovies)
  displayLikedMovies(likedMovies);
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies();
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  const cast = await getCast(randomMovie);
  const rating = await getRating(randomMovie);
  console.log(rating)
  displayMovie(info, cast, rating);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;