export const appConfig = {
    TMDB_MOVIE_BASE_URL: 'https://api.themoviedb.org/3/movie',
    TMDB_SERIES_BASE_URL: 'https://api.themoviedb.org/3/tv',
    TMDB_SERIES_DETAILS_BASE_URL: 'https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}',
    NOW_PLAYING_MOVIE: 'https://api.themoviedb.org/3/movie/now_playing',
    TMDB_API_KEY: '207839711e7c1e00f3b1a9031db10828',
    NOW_PLAYING_TV_SERIES: 'https://api.themoviedb.org/3/tv/airing_today',
    TOP_RATED_TV_SERIES: 'https://api.themoviedb.org/3/discover/tv',
    TRENDING_MOVIE: 'https://api.themoviedb.org/3/trending/movie',
    TOP_RATED_HINDI_MOVIE: 'https://api.themoviedb.org/3/discover/movie',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    MOVIE_GENRES: 'https://api.themoviedb.org/3/genre/movie/list',
    MOVIE_CAST: 'https://api.themoviedb.org/3/movie',
    SERIES_CAST: 'https://api.themoviedb.org/3/tv',
    SIMILAR_MOVIES: 'https://api.themoviedb.org/3/movie',
    SIMILAR_SERIES: 'https://api.themoviedb.org/3/tv',
    DEFAULT_IMAGE_SIZE: 'w500',
    BACKDROP_SIZE: 'original',
    trending: `/api/movies/trending`,
    popular: `/api/movies/popular`,
    topRated: `/api/movies/top-rated`,
    // movieDetails: (id: any) => `/api/movies/${id}`,
    // search: (query: any) => `/api/movies/search?query=${query}`,
    // genre: (genreId: any) => `/api/discover/movie?with_genres=${genreId}`
    movieDetails: (id: any) => `/api/movies/${id}`,
    search: (query: any) => `/api/movies/search?query=${query}`,
    genre: (genreId: any) => `/api/discover/movie?with_genres=${genreId}`,
    STREAMING_MOVIE_URL: 'https://vidsrc.to/embed/movie',
    STREAMING_SERIES_URL: 'https://vidsrc.to/embed/tv',

};

// API Endpoints
// export const ENDPOINTS = {
//     trending: `/api/movies/trending`,
//     popular: `/api/movies/popular`,
//     topRated: `/api/movies/top-rated`,
//     movieDetails: (id: any) => `/api/movies/${id}`,
//     search: (query: any) => `/api/movies/search?query=${query}`,
//     genre: (genreId: any) => `/api/discover/movie?with_genres=${genreId}`
// };

// function getImageUrl(path: any, size = CONFIG.DEFAULT_IMAGE_SIZE) {
//     if (!path) return 'img/placeholder.jpg';
//     return `${CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
// }