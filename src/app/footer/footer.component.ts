import { Component } from '@angular/core';
import { MasterService } from '../master.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

    movieGenresData: any[] = [];
    randomGenres: any[] = [];
    country: string = 'all';
  
    constructor(private masterService: MasterService, private router: Router) {
      this.movieGenres();
    }

  movieGenres() {
    this.masterService.getMovieGenres().subscribe({
      next: (data: any) => {
        this.movieGenresData = data.genres;
        this.randomGenres = this.getRandomGenres(this.movieGenresData, 6);
      },
      error: (err: any) => {
        console.error('Error fetching movie genres:', err);
      }
    });
  }

  getRandomGenres(genres: any[], count: number): any[] {
    return genres.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  navigateToTrendingMovies() {
    this.masterService.goToTrendingMovies();
  }

  navigateToTrendingTvShows() {
    this.masterService.goToTrendingTvShows();
  }

  navigateToTopImdbMovies() {
    this.masterService.goToTopImdbMovies();
  }

  applyFilter(filterType: string, value: string) {
    if (filterType === 'country') this.country = value;

    this.router.navigate(['/category', 'movie', this.country, 'all', 'trending']);
  }

  // goToMoviesByGenre(id: number) {
  //   this.masterService.getMoviesByGenre(id).subscribe(
  //     (response) => {
  //       this.movies = response.results;
  //       console.log(this.movies);
  //       console.log();
  //     },
  //     (error) => {
  //       console.error('Error fetching movies:', error);
  //     }
  //   );
  // }

  goToMoviesByGenre(id: number) {
    this.router.navigate(['/category/genre'], {
      queryParams: {
        genre: id
      }
    });
  }

}
