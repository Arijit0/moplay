import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from './appConfig';
import { forkJoin, map, Observable, of, shareReplay } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private trendingMoviesCache: any;
  private nowPlayingMoviesCache: any;
  private specificTvSeasonDetailsCache: { [key: string]: any } = {};
  private seriesDetailsCache: { [key: string]: any } = {};
  private movieDetailsCache: { [key: string]: any } = {};
  private topRatedHindiMoviesCache: any;
  private topRatedBengaliMoviesCache: any;
  private topRatedHindiTvSeriesCache: any;
  private nowPlayingTvSeriesCache: any;
  private movieGenresCache: any;
  private movieCastCache: { [key: string]: any } = {};
  private seriesCastCache: { [key: string]: any } = {};
  private similarMoviesCache: { [key: string]: any } = {};
  private similarSeriesCache: { [key: string]: any } = {};
  private moviesOrTvBulkCache: { [key: string]: Observable<any[]> } = {};

  private COUNTRY = 'IN'; // Hardcoded for India
  private cache = new Map<number, Observable<any>>(); // Cache to store API responses
  private BASE_URL = 'https://tmdb-proxy.bagarijit0.workers.dev/tmdb/discover/movie';

  private API_URL = 'https://tmdb-proxy.bagarijit0.workers.dev/tmdb';

  constructor(private http: HttpClient, private router: Router) { }

  getMovieDetails(movieID: string) {
    if (!this.movieDetailsCache[movieID]) {
      this.movieDetailsCache[movieID] = this.http.get(`${appConfig.TMDB_MOVIE_BASE_URL}/${movieID}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.movieDetailsCache[movieID];
  }

  getSeriesDetails(seriesID: string) {
    if (!this.seriesDetailsCache[seriesID]) {
      this.seriesDetailsCache[seriesID] = this.http.get(`${appConfig.TMDB_SERIES_BASE_URL}/${seriesID}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.seriesDetailsCache[seriesID];
  }

  getSpecificTvSeasonDetails(seriesID: string, seasonNUM: string) {
    const cacheKey = `${seriesID}-${seasonNUM}`;
    if (!this.specificTvSeasonDetailsCache[cacheKey]) {
      this.specificTvSeasonDetailsCache[cacheKey] = this.http.get(`${appConfig.TMDB_SERIES_BASE_URL}/${seriesID}/season/${seasonNUM}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.specificTvSeasonDetailsCache[cacheKey];
  }

  getNowPlayingMovies() {
    if (!this.nowPlayingMoviesCache) {
      this.nowPlayingMoviesCache = this.http.get(`${appConfig.NOW_PLAYING_MOVIE}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.nowPlayingMoviesCache;
  }


  getTrendingMovies() {
    if (!this.trendingMoviesCache) {
      this.trendingMoviesCache = this.http.get(`${appConfig.TRENDING_MOVIE}/day?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.trendingMoviesCache;
  }

  getTopRatedHindiMovies() {
    if (!this.topRatedHindiMoviesCache) {
      this.topRatedHindiMoviesCache = this.http.get(`${appConfig.TOP_RATED_HINDI_MOVIE}?api_key=${appConfig.TMDB_API_KEY}&with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=100`).pipe(
        shareReplay(1)
      );
    }
    return this.topRatedHindiMoviesCache;
  }

  getTopRatedBengaliMovies() {
    if (!this.topRatedBengaliMoviesCache) {
      this.topRatedBengaliMoviesCache = this.http.get(`${appConfig.TOP_RATED_HINDI_MOVIE}?api_key=${appConfig.TMDB_API_KEY}&with_original_language=bn&sort_by=vote_average.desc&vote_count.gte=50`).pipe(
        shareReplay(1)
      );
    }
    return this.topRatedBengaliMoviesCache;
  }

  getNowPlayingTvSeries() {
    if (!this.nowPlayingTvSeriesCache) {
      this.nowPlayingTvSeriesCache = this.http.get(`${appConfig.NOW_PLAYING_TV_SERIES}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.nowPlayingTvSeriesCache;
  }

  getTopRatedHindiTvSeries() {
    if (!this.topRatedHindiTvSeriesCache) {
      this.topRatedHindiTvSeriesCache = this.http.get(`${appConfig.TOP_RATED_TV_SERIES}?api_key=${appConfig.TMDB_API_KEY}&with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=50`).pipe(
        shareReplay(1)
      );
    }
    return this.topRatedHindiTvSeriesCache;
  }

  getMovieGenres() {
    if (!this.movieGenresCache) {
      this.movieGenresCache = this.http.get(`${appConfig.MOVIE_GENRES}?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.movieGenresCache;
  }

  getMovie(ID: any): Observable<any> {
    return of(`${appConfig.STREAMING_MOVIE_URL}/${ID}`);
  }

  getSeries(ID: any): Observable<any> {
    return of(`${appConfig.STREAMING_SERIES_URL}/${ID}`);
  }

  // Cache for movie cast
  getMovieCast(movieID: any) {
    if (!this.movieCastCache[movieID]) {
      this.movieCastCache[movieID] = this.http.get(`${appConfig.MOVIE_CAST}/${movieID}/credits?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.movieCastCache[movieID];
  }

  // Cache for movie cast
  getSeriesCast(ID: any) {
    if (!this.seriesCastCache[ID]) {
      this.seriesCastCache[ID] = this.http.get(`${appConfig.SERIES_CAST}/${ID}/credits?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.seriesCastCache[ID];
  }

  // Cache for similar movies
  getSimilarMovies(movieID: any) {
    if (!this.similarMoviesCache[movieID]) {
      this.similarMoviesCache[movieID] = this.http.get(`${appConfig.SIMILAR_MOVIES}/${movieID}/similar?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.similarMoviesCache[movieID];
  }

  // Cache for similar movies
  getSimilarSeries(ID: any) {
    if (!this.similarSeriesCache[ID]) {
      this.similarSeriesCache[ID] = this.http.get(`${appConfig.SIMILAR_SERIES}/${ID}/similar?api_key=${appConfig.TMDB_API_KEY}`).pipe(
        shareReplay(1)
      );
    }
    return this.similarSeriesCache[ID];
  }

  goToMovieDetails(ID: any) {
    this.router.navigate(['/movie-details', ID]);
  }

  goToSeriesDetails(ID: any) {
    this.router.navigate(['/series-details', ID]);
  }

  goToTrendingMovies() {
    this.router.navigate(['/category', 'movie','IN',2025,'trending']);
  }

  goToTrendingTvShows() {
    this.router.navigate(['/category', 'tv','IN',2025,'trending']);
  }

  goToTopImdbMovies() {
    this.router.navigate(['/category', 'movie','IN',2025,'top-imdb']);
  }


  getMoviesOrTVBulk(
    type: string, 
    country: string, 
    year: string, 
    sort: string,  // 'latest', 'trending', 'top-imdb'
    totalPages: number, 
  ): Observable<any[]> { 
    const cacheKey = `${type}-${country}-${year}-${sort}-${totalPages}`;
  
    if (!this.moviesOrTvBulkCache[cacheKey]) {
      const requests = Array.from({ length: totalPages }, (_, i) => {
        // Fix endpoint: ensure type is 'movie' or 'tv'
        const endpoint = type === 'movie' ? 'movie' : 'tv';
        let url = `https://tmdb-proxy.bagarijit0.workers.dev/tmdb/discover/${endpoint}?api_key=${appConfig.TMDB_API_KEY}&page=${i + 1}`;
  
        // Year Filter
        if (year && year !== 'all') {
          const yearParam = type === 'movie' 
            ? `primary_release_year=${year}` 
            : `first_air_date_year=${year}`;
          url += `&${yearParam}`;
        }
  
        // Country Filter
        if (country && country !== 'all') {
          url += `&with_origin_country=${country}`;
        }
  
        // Sorting Logic
        switch(sort) {
          case 'latest':
            url += type === 'movie' 
              ? '&sort_by=primary_release_date.desc' 
              : '&sort_by=first_air_date.desc';
            break;
          case 'trending':
            url += '&sort_by=popularity.desc';
            break;
          case 'top-imdb':
            url += '&sort_by=vote_average.desc';
            // Realistic vote count filter (lowered from 20,000)
            url += '&vote_count.gte=20000'; 
            break;
        }
  
        return this.http.get<any>(url);
      });
  
      this.moviesOrTvBulkCache[cacheKey] = forkJoin(requests).pipe(
        map(responses => responses.flatMap(response => response.results)),
        shareReplay(1)
      );
    }
    
    return this.moviesOrTvBulkCache[cacheKey];
  }
  

  searchMoviesOrTV(query: string, type: string, page: number = 1): Observable<any> {
    const url = `${this.API_URL}/search/${type}?api_key=${appConfig.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    return this.http.get<any>(url);
  }

  multiSearch(query: string, page: number = 1): Observable<any> {
    const url = `${this.API_URL}/search/multi?api_key=${appConfig.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    return this.http.get<any>(url);
  }

  getMoviesByGenre(genreId: number): Observable<any> {
    // Return cached response if available
    if (this.cache.has(genreId)) {
      return this.cache.get(genreId)!;
    }

    // If not cached, fetch from API and cache the result
    const request$ = this.http.get<any>(
      `${this.BASE_URL}?api_key=${appConfig.TMDB_API_KEY}&with_genres=${genreId}&region=${this.COUNTRY}&with_origin_country=${this.COUNTRY}&page=${10}`
    ).pipe(shareReplay(1)); // Cache the response

    this.cache.set(genreId, request$); // Store in cache

    return request$;
  }

}
