import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MasterService } from '../master.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { appConfig } from '../appConfig';
import { FooterComponent } from "../footer/footer.component";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
declare var bootstrap: any;
declare var window: any;

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, CarouselModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit,OnInit {

movieDetails: any[] = [
  {
    imdbId: 'tt16539454',
    imageUrl: 'assets/Images/pushpa-2.jpg',
    alt: 'pushpa-2',
    youTubeID: '1kVK0MZlbI4'
  },
  {
    imdbId: 'tt13622970',
    imageUrl: 'assets/Images/Moana-2.jpg',
    alt: 'Moana-2',
    youTubeID: 'hDZ7y8RP5HE'
  },
  {
    imdbId: 'tt31456973',
    imageUrl: 'assets/Images/Alarum.jpg',
    alt: 'Alarum',
    youTubeID: '_6dlIjZjFq4'
  }
];

seriesDetails: any[] = [
  {
    imdbId: '93405',
    imageUrl: 'assets/Images/squid-game-season-2.jpg',
    alt: 'squid-game-season-2',
    youTubeID: '-3PnkQO_y_M'
  },
];

  moviesData: any[] = [];
  seriesData: any[] = [];
  safeUrl:  SafeResourceUrl | null = null;
  nowPlayingMoviesData: any[] = [];
  toolTipMovieDetailsData: any = {};
  isHoveringOverMovie = false;
  trendingMoviesData: any[] = [];
  topRatedHindiMoviesData: any[] = [];
  topRatedBengaliMoviesData: any[] = [];
  nowPlayingTvSeriesData: any[] = [];
  topRatedHindiTvSeriesData: any[] = [];

  constructor(
    private sanitizer: DomSanitizer,
     private masterService: MasterService, 
     @Inject(PLATFORM_ID) private platformId: object,
     private router: Router) {

    this.fetchMovieDetails();
    this.fetchSeriesDetails();
    this.nowPlayingMovies();
    this.trendingMovies();
    this.topRatedHindiMovies();
    this.topRatedBengaliMovies();
    this.nowPlayingTvSeries();
    this.topRatedHindiTvSeries();
   }

   // Listen for the modal close event
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    const modalElement = document.getElementById('youtubeModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.onModalClose();
      });
    }
  }
  }

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    });

  }

  // Options for the banner section carousel
  customOptions: OwlOptions = {
    loop: true,             // Loop the carousel infinitely
    items: 1,               // Show one item at a time
    mouseDrag: true,        // Allow mouse drag
    touchDrag: true,        // Allow touch drag (on mobile)
    pullDrag: true,         // Enable pull-to-refresh (optional)
    dots: true,             // Enable navigation dots
    navSpeed: 700,          // Set transition speed between slides
    navText: ['', ''],      // Custom navigation arrows (empty if not needed)
    nav: false,              // Enable navigation arrows
    autoHeight: true,
    autoplay: true,         // Enable auto-sliding
    autoplayTimeout: 4000,  // Set the time (in milliseconds) between auto transitions (5000ms = 5 seconds)
    autoplayHoverPause: true, // Pause autoplay when the user hovers over the carousel
    responsive: {
      0: {
        items: 1  // Show 1 item at a time for small screens
      },
      400: {
        items: 1  // Show 1 item at a time for medium screens
      },
      740: {
        items: 1  // Show 1 item at a time for large screens
      },
      940: {
        items: 1  // Show 1 item at a time for very large screens
      }
    }
  };

// Options for the latest movies carousel
latestMoviesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText:[
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

// Options for the trending movies carousel
trendingMoviesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  rtl: false,
  navText:[
    '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
    '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
  ],
  nav: true,
  autoplay: true,
  autoplayTimeout: 3500,
  autoplayHoverPause: true,
  autoHeight: true,
  responsive: {
    0: { items: 2 },
    400: { items: 2 },
    740: { items: 3 },
    940: { items: 6 }
  }
};

// Options for the top rated Hindi movies carousel
topRatedHindiMoviesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText:[
    '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
    '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
  ],
  nav: true,
  autoplay: true,
  autoplayTimeout: 2000,
  autoplayHoverPause: true,
  autoHeight: true,
  responsive: {
    0: { items: 2 },
    400: { items: 2 },
    740: { items: 3 },
    940: { items: 6 }
  }
};

// Options for the top rated Hindi movies carousel
topRatedBengaliMoviesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText:[
    '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
    '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
  ],
  nav: true,
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: true,
  autoHeight: true,
  responsive: {
    0: { items: 2 },
    400: { items: 2 },
    740: { items: 3 },
    940: { items: 6 }
  }
};

// Options for the top rated Hindi movies carousel
nowPlayingTvSeriesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText:[
    '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
    '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
  ],
  nav: true,
  autoplay: true,
  autoplayTimeout: 3500,
  autoplayHoverPause: true,
  autoHeight: true,
  responsive: {
    0: { items: 2 },
    400: { items: 2 },
    740: { items: 3 },
    940: { items: 6 }
  }
};

// Options for the top rated Hindi movies carousel
topRatedHindiTvSeriesOptions: OwlOptions = {
  loop: true,
  items: 6,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText:[
    '<button class="owl-nav-button prev-btn"><i class="fas fa-chevron-left"></i></button>',  // Previous button with icon
    '<button class="owl-nav-button next-btn"><i class="fas fa-chevron-right"></i></button>'  // Next button with icon
  ],
  nav: true,
  autoplay: true,
  autoplayTimeout: 4000,
  autoplayHoverPause: true,
  autoHeight: true,
  responsive: {
    0: { items: 2 },
    400: { items: 2 },
    740: { items: 3 },
    940: { items: 6 }
  }
};

    // Sanitize YouTube trailer URL
    sanitizeTrailerUrl(videoId: string): SafeResourceUrl {
      // Sanitize the URL to create a safe embedding URL
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=0`);
    }


// Function to format the runtime of a movie
  formatRuntime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  // Function to fetch movie details from the API
  fetchMovieDetails() {

      // Loop over the IMDb IDs and fetch movie details for each
    this.movieDetails.forEach((movie: any,index: number) => {
      this.masterService.getMovieDetails(movie.imdbId).subscribe({
        next: (data: any) => {
           // Match movie data with image links by index
           const movieWithImage = { ...data, image: movie.imageUrl, trailerID: movie.youTubeID };
           this.moviesData.push(movieWithImage); // Add movie with image to moviesData
        },
        error: (err: any) => {
          console.error('Error fetching movie details for IMDb ID:', err);
        }
      });
    });
  }
  
  // Function to fetch movie details from the API
  fetchSeriesDetails() {

      // Loop over the IMDb IDs and fetch movie details for each
    this.seriesDetails.forEach((series,index) => {
      this.masterService.getSeriesDetails(series.imdbId).subscribe({
        next: (data: any) => {
          // Match movie data with image links by index
          const movieWithImage = { ...data, tvSeriesimage: series.imageUrl, trailerID: series.youTubeID };
          this.seriesData.push(movieWithImage); // Add movie with image to moviesData
        },
        error: (err: any) => {
          console.error('Error fetching series details for IMDb ID:', err);
        }
      });
    });
  }

  playYoutubeTrailer(trailerUrl: string) {
    this.safeUrl = this.sanitizeTrailerUrl(trailerUrl);
  }

    // Function to close the modal and stop the video
    closeModal() {
      this.safeUrl = null; // Reset the trailer URL (stops the video)
      const modalElement = document.getElementById('modal-backdrop');
      
      // If modal exists, create a new Bootstrap modal instance and hide it
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.hide();  // Close the modal
      }
    }

      // Action when modal closes
  onModalClose() {
    console.log('Modal has been closed!');
    this.safeUrl = null;  // Stop the video when the modal is closed (including backdrop click)
  }

  // Function to fetch now playing movies from the API
  nowPlayingMovies() {
    this.masterService.getNowPlayingMovies().subscribe({
      next: (data: any) => {
        data.results.forEach((movie: any) => {
          // Fetch movie details for each movie
          this.masterService.getMovieDetails(movie.id).subscribe({
            next: (movieData: any) => {
              // Match movie data with image links by index
              const movieWithImage = { ...movieData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` };
              this.nowPlayingMoviesData.push(movieWithImage); // Add movie with image to nowPlayingMoviesData
              // console.log('Now playing movies:', this.nowPlayingMoviesData);
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

// Function to fetch trending movies from the API
trendingMovies() {
  this.masterService.getTrendingMovies().subscribe({
    next: (data: any) => {
      data.results.forEach((movie: any) => {
        // Fetch movie details for each movie
        this.masterService.getMovieDetails(movie.id).subscribe({
          next: (movieData: any) => {
            // Match movie data with image links by index
            const movieWithImage = { ...movieData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` };
            this.trendingMoviesData.push(movieWithImage); // Add movie with image to nowPlayingMoviesData
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

// Function to fetch top rated Hindi movies from the API
topRatedHindiMovies() {
  this.masterService.getTopRatedHindiMovies().subscribe({
    next: (data: any) => {
      data.results.forEach((movie: any) => {
        // Fetch movie details for each movie
        this.masterService.getMovieDetails(movie.id).subscribe({
          next: (movieData: any) => {
            // Match movie data with image links by index
            const movieWithImage = { ...movieData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` };
            this.topRatedHindiMoviesData.push(movieWithImage);
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

// Function to fetch top rated Bengali movies from the API
topRatedBengaliMovies() {
  this.masterService.getTopRatedBengaliMovies().subscribe({
    next: (data: any) => {
      data.results.forEach((movie: any) => {
        // Fetch movie details for each movie
        this.masterService.getMovieDetails(movie.id).subscribe({
          next: (movieData: any) => {
            // Match movie data with image links by index
            const movieWithImage = { ...movieData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` };
            this.topRatedBengaliMoviesData.push(movieWithImage);
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

// Function to fetch now playing TV series from the API
nowPlayingTvSeries() {
  this.masterService.getNowPlayingTvSeries().subscribe({
    next: (data: any) => {
      data.results.forEach((series: any) => {
        // Fetch movie details for each movie
        this.masterService.getSeriesDetails(series.id).subscribe({
          next: (seriesData: any) => {
            // Match movie data with image links by index
            const seriesWithImage = { ...seriesData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${series.poster_path}` };
            this.nowPlayingTvSeriesData.push(seriesWithImage);
          },
          error: (err: any) => {
            console.error('Error fetching series details for now playing movies:', err);
          }
        });
      });
    },
    error: (err: any) => {
      console.error('Error fetching now playing series:', err); 
    }
  });
}

// Function to fetch top rated Hindi TV series from the API
topRatedHindiTvSeries() {
  this.masterService.getTopRatedHindiTvSeries().subscribe({
    next: (data: any) => {
      data.results.forEach((series: any) => {
        // Fetch movie details for each movie
        this.masterService.getSeriesDetails(series.id).subscribe({
          next: (seriesData: any) => {
            // Match movie data with image links by index
            const seriesWithImage = { ...seriesData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${series.poster_path}` };
            this.topRatedHindiTvSeriesData.push(seriesWithImage);
          },
          error: (err: any) => {
            console.error('Error fetching series details for now playing movies:', err);
          }
        });
      });
    },
    error: (err: any) => {
      console.error('Error fetching now playing series:', err); 
    }
  });
}

// Function to show movie details and redirect to details page
navigateToMovieDetails(movie: any) {
  this.masterService.goToMovieDetails(movie.imdb_id);
}

// Function to show Series details and redirect to details page
navigateToSeriesDetails(series: any) {
  this.masterService.goToSeriesDetails(series.id);
}

}

