import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MasterService } from '../master.service';
import { appConfig } from '../appConfig';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, transition, style, animate } from '@angular/animations';
import { catchError, combineLatest, filter, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [HeaderComponent, CommonModule, FooterComponent, FormsModule, NgxPaginationModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.55)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ]
})

export class CategoryComponent implements OnInit {
  type: string = 'movies';
  country: string = 'IN';
  year: string = new Date().getFullYear().toString();
  sort: string = 'trending';
  genreID: any | undefined;
  searchQuery: string | undefined;
  moviesDataArr: any[] = [];
  seriesDataArr: any[] = [];
  allMediaDataArr: any[] = [];
  totalMovies: number = 0;
  moviePage = 1;
  seriesPage = 1;
  combineMovieAndSeriesPage: any = 1;

  p: number = 1; // Current page in ngx-pagination
  itemsPerPage: number = 20; // Number of items per page

  constructor(
    private masterService: MasterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // ngOnInit() {

  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  //   ).subscribe(() => {
  //     window.scrollTo({ 
  //       top: 500, 
  //       behavior: 'smooth' 
  //     });
  //   });

  //   this.route.queryParams.subscribe(queryParams => {
  //     this.searchQuery = queryParams['query'] || '';

  //     if (this.searchQuery) {
  //       this.searchMovies();
  //     } 
  //     // else {
  //     //   this.fetchMovies();
  //     // }
  //   });

  //   this.route.params.subscribe(params => {
  //     this.type = params['type'] || 'movie';
  //     this.country = params['country'] || 'all';
  //     this.year = params['year'] || 'all';
  //     this.sort = params['sort'] || 'trending';

  //     // Fetch movies ONLY IF there's NO active search query
  //     if (!this.searchQuery && !this.genreID) {
  //       this.fetchMovies();
  //     }

  //   });

  //   this.route.queryParams.subscribe(queryParams => {
  //     this.genreID = queryParams['genre'] || '';

  //     if (this.genreID && !this.searchQuery) {
  //       this.getMoviesByGenre();
  //     }
  //   });

  // }



  ngOnInit(): void {
    // Smooth scroll on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ 
        top: 500, 
        behavior: 'smooth' 
      });
    });

    // Combine both queryParams and params into a single subscription
    combineLatest([this.route.queryParams, this.route.params])
      .subscribe(([queryParams, params]) => {
        this.searchQuery = queryParams['query'] || '';
        this.genreID = queryParams['genre'] || '';

        this.type = params['type'] || 'movie';
        this.country = params['country'] || 'all';
        this.year = params['year'] || 'all';
        this.sort = params['sort'] || 'trending';

        // Handling different cases for fetching movies
        if (this.searchQuery) {
          this.searchMovies();
        } else if (this.genreID) {
          this.getMoviesByGenre();
        } else {
          this.fetchMovies();
        }
      });
  }

  // Function to format the runtime of a movie
  formatRuntime(minutes: number | undefined): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  fetchMovies() {
    this.moviesDataArr = []; // Clear arrays to prevent duplicate data
    this.seriesDataArr = [];

    this.masterService.getMoviesOrTVBulk(this.type, this.country, this.year, this.sort, 5)
      .subscribe((data: any) => {
        if (!data || data.length === 0) {
          console.warn("No data found");  // Log when API returns no results
          return;
        }

        // Prepare an array of observables for movie/TV show details
        const detailRequests = data.map((item: any) => {
          item.media_type = item.title ? 'movie' : 'tv'; // If title exists, it's a movie; otherwise, it's a TV show.

          return item.media_type === 'movie'
            ? this.masterService.getMovieDetails(item.id)
            : this.masterService.getSeriesDetails(item.id);
        });

        // Fetch all details in parallel using forkJoin
        forkJoin(detailRequests).subscribe(
          (value: unknown) => {
            const detailsArray = value as any[];
            detailsArray.forEach((itemData, index) => {
              const item = data[index]; // Get the corresponding item
              const itemWithImage = {
                ...itemData,
                image: item.poster_path ? `${appConfig.TMDB_IMAGE_BASE_URL}/w500${item.poster_path}` : "assets/no-image.png"
              };

              if (item.media_type === 'movie') {
                this.moviesDataArr.push(itemWithImage);
                // console.log('Movies', this.moviesDataArr);
              } else {
                this.seriesDataArr.push(itemWithImage);
                // console.log('TV', this.seriesDataArr);
              }
            });
          },
          (err: any) => console.error('Error fetching movie/TV details:', err)
        );
      },
        (err: any) => console.error('Error fetching items:', err));
  }


  searchMovies() {
    this.allMediaDataArr = []; // Clear previous search results

  this.masterService.multiSearch(this.searchQuery!)
    .subscribe((data: any) => {
      console.log("Raw API response:", data);

      if (!data || !Array.isArray(data.results)) {
        console.warn("Invalid API response format.");
        return;
      }

      // ✅ Correct Filtering (Fix the `=` issue)
      const filteredItems = data.results.filter((item: any) =>
        item.media_type === 'movie' || item.media_type === 'tv'
      );

      if (filteredItems.length === 0) {
        console.warn("No movies or TV series found.");
        return;
      }

      // ✅ Wrap API calls with `catchError` to prevent `forkJoin` failure
      const detailRequests = filteredItems.map((item: any) =>
        (item.media_type === 'movie'
          ? this.masterService.getMovieDetails(item.id)
          : this.masterService.getSeriesDetails(item.id)
        ).pipe(
          catchError(err => {
            console.error(`Error fetching details for ID ${item.id}:`, err);
            return of(null); // Returns `null` instead of failing forkJoin
          })
        )
      );

      // ✅ `forkJoin` now executes even if some API calls fail
      forkJoin(detailRequests).subscribe(
        (detailsArray: any) => {
          // ✅ Filter out `null` responses from failed API calls
          detailsArray.filter((item: any) => item !== null).forEach((itemData: any, index: any) => {
            const item = filteredItems[index];
            if (!itemData) return;

            this.allMediaDataArr.push({
              ...itemData,
              image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`
            });
          });
        },
        (err: any) => console.error('Error fetching movie/TV details:', err)
      );
    },
    (err: any) => console.error('Error fetching items:', err));
  }

  search(event: Event) {
    event.preventDefault(); // Prevents page refresh on form submission
    if (this.searchQuery!.trim()) {
      this.router.navigate(['/category/search'], {
        queryParams: {
          query: this.searchQuery
        }
      });
    } else {
      this.router.navigate(['/category', this.type, this.country, this.year, this.sort]);
    }
  }

  applyFilter(filterType: string, value: string) {
    if (filterType === 'type') this.type = value;
    if (filterType === 'country') this.country = value;
    if (filterType === 'year') this.year = value;
    if (filterType === 'sort') this.sort = value;

    this.router.navigate(['/category', this.type, this.country, this.year, this.sort]);
  }

  // Function to show movie details and redirect to details page
  navigateToMovieDetails(movie: any) {
    console.log(movie);
    this.masterService.goToMovieDetails(movie.imdb_id);
  }

  // Function to show Series details and redirect to details page
  navigateToSeriesDetails(series: any) {
    console.log(series);
    this.masterService.goToSeriesDetails(series.id);
  }

  getMoviesByGenre() {

    this.allMediaDataArr = []; // Clear array before new search results

    this.masterService.getMoviesByGenre(this.genreID)
      .subscribe((data: any) => {

        if (!data || !Array.isArray(data.results)) {
          return;
        }

        // Filter only movies & TV shows (exclude 'person', 'collection', etc.)
        const filteredItems = data.results.map((item: any) => ({
          ...item,
          media_type: item.title ? 'movie' : 'tv' // Assign media_type properly
        }));

        if (filteredItems.length === 0) {
          console.warn("No movies or TV series found.");
          return;
        }

        // Fetch details for each item
        const detailRequests = filteredItems.map((item: any) =>
          item.media_type === 'movie'
            ? this.masterService.getMovieDetails(item.id)
            : this.masterService.getSeriesDetails(item.id)
        );

        // Explicitly cast the response from forkJoin to an array
        forkJoin(detailRequests).subscribe(
          (value) => {
            const detailsArray = value as any[]; // ✅ Fix: Explicitly cast to an array
            detailsArray.forEach((itemData, index) => {
              const item = filteredItems[index];
              const itemWithImage = {
                ...itemData,
                image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`
              };

              this.allMediaDataArr.push(itemWithImage);
            });

          },
          (err: any) => console.error('Error fetching movie/TV details:', err)
        );
      },
        (err: any) => console.error('Error fetching items:', err));
  }


}
