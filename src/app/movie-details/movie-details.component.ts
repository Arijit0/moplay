import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { MasterService } from '../master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appConfig } from '../appConfig';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-movie-details',
  imports: [HeaderComponent, FooterComponent, CommonModule, CarouselModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {

  movieID: any;
  safeMovieUrl: SafeResourceUrl | null = null;
  moviesData: any = {};
  movieCastData: any[] = [];
  directorsData: any[] = [];
  similarMoviesData: any[] = [];

  // Options for the latest movies carousel
  similarMoviesOptions: OwlOptions = {
    loop: true,
    items: 6,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
      '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
    ],
    nav: true,
    autoplay: true,
    autoplayTimeout: 2700,
    autoplayHoverPause: true,
    autoHeight: true,
    responsive: {
      0: { items: 2 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 6 }
    }
  };

  constructor(
    private masterService: MasterService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.router.events.subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 🚀 Scroll to top smoothly
    });

    // Listen for route changes and reload movie data
    this.route.params.subscribe(params => {
      this.movieID = params['id'];
      this.loadMovieData();
    });

  }

  loadMovieData(): void {
    this.streamMovie();
    this.fetchMovieDetails();
    this.getMovieCast();
    this.getSimilarMovies();
  }

  // Function to format the runtime of a movie
  formatRuntime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  //function to stream movie
  streamMovie() {

    this.masterService.getMovie(this.movieID).subscribe({
      next: (data: any) => {
        if (data) {
          this.safeMovieUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        }
      },
      error: (err: any) => {
        console.error('Error fetching movie streming link:', err);
      }
    });
  }

  // Function to fetch movie details from the API
  fetchMovieDetails() {

    this.masterService.getMovieDetails(this.movieID).subscribe({
      next: (data: any) => {
        // Match movie data with image links by index
        this.moviesData = { ...data, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${data.poster_path}` };
      },
      error: (err: any) => {
        console.error('Error fetching movie details for IMDb ID:', err);
      }
    });
  }

  // Function to fetch movie cast from the API
  getMovieCast() {
    this.masterService.getMovieCast(this.movieID).subscribe({
      next: (data: any) => {
        this.movieCastData = data.cast; // This contains actors only
        this.directorsData = data.crew.filter((person: any) => person.job === "Director"); // Fetch director(s)
      },
      error: (err: any) => {
        console.error('Error fetching movie cast:', err);
      }
    });
  }

  getSimilarMovies() {
    this.masterService.getSimilarMovies(this.movieID).subscribe({
      next: (data: any) => {
        data.results.forEach((movie: any) => {
          // Fetch movie details for each movie
          this.masterService.getMovieDetails(movie.id).subscribe({
            next: (movieData: any) => {
              // Match movie data with image links by index
              const movieWithImage = { ...movieData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` };
              this.similarMoviesData.push(movieWithImage);
            },
            error: (err: any) => {
              console.error('Error fetching movie details for now playing movies:', err);
            }
          });
        });
      },
      error: (err: any) => {
        console.error('Error fetching now playing movies:', err);
      }
    });
  }

  // Function to show movie details and redirect to details page
  navigateToDetails(movie: any) {
    this.masterService.goToMovieDetails(movie.imdb_id);
  }

}
