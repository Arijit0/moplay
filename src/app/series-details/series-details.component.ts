import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MasterService } from '../master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appConfig } from '../appConfig';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-series-details',
  imports: [HeaderComponent, CommonModule, FooterComponent, CarouselModule],
  templateUrl: './series-details.component.html',
  styleUrl: './series-details.component.css'
})
export class SeriesDetailsComponent implements OnInit {

  seriesID: any;
  safeSeriesUrl: SafeResourceUrl | null = null;
  seriesData: any = {};
  seriesCastData: any[] = [];
  directorsData: any[] = [];
  similarSeriesData: any[] = [];

  // Options for the latest movies carousel
  similarSeriesOptions: OwlOptions = {
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
      this.seriesID = params['id'];
      this.loadSeriesData();
    });

  }

  loadSeriesData(): void {
    this.streamSeries();
    this.fetchSeriesDetails();
    this.getSeriesCastData();
    this.getSimilarSeriesData();
  }

  // Function to format the runtime of a movie
  formatRuntime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  //function to stream movie
  streamSeries() {

    this.masterService.getSeries(this.seriesID).subscribe({
      next: (data: any) => {
        if (data) {
          this.safeSeriesUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        }
      },
      error: (err: any) => {
        console.error('Error fetching movie streming link:', err);
      }
    });
  }

  // Function to fetch movie details from the API
  fetchSeriesDetails() {

    this.masterService.getSeriesDetails(this.seriesID).subscribe({
      next: (data: any) => {
        // Match movie data with image links by index
        this.seriesData = { ...data, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${data.poster_path}` };
        console.log(this.seriesData);
      },
      error: (err: any) => {
        console.error('Error fetching movie details for IMDb ID:', err);
      }
    });
  }


  // Function to fetch movie cast from the API
  getSeriesCastData() {
    this.masterService.getSeriesCast(this.seriesID).subscribe({
      next: (data: any) => {
        this.seriesCastData = data.cast; // This contains actors only
        this.directorsData = data.crew.filter((person: any) => person.job === "Director"); // Fetch director(s)
      },
      error: (err: any) => {
        console.error('Error fetching movie cast:', err);
      }
    });
  }

  getSimilarSeriesData() {
    this.masterService.getSimilarSeries(this.seriesID).subscribe({
      next: (data: any) => {
        data.results.forEach((series: any) => {
          // Fetch series details for each movie
          this.masterService.getSeriesDetails(series.id).subscribe({
            next: (seriesData: any) => {
              // Match series data with image links by index
              const seriesWithImage = { ...seriesData, image: `${appConfig.TMDB_IMAGE_BASE_URL}/w500${series.poster_path}` };
              this.similarSeriesData.push(seriesWithImage);
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
  navigateToDetails(series: any) {
    this.masterService.goToSeriesDetails(series.id);
  }

}
