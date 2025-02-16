import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MasterService } from '../master.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  movieGenresData: any[] = [];
  searchQuery: string | undefined;
  country: string = 'all';

  constructor(private masterService: MasterService, private router: Router) {
    this.movieGenres();
  }

  onSearch(event: Event) {
    event.preventDefault(); // Prevents page refresh on form submission
    if (this.searchQuery!.trim()) {
      this.router.navigate(['/category/search'], {
        queryParams: {
          query: this.searchQuery
        }
      });
    }
  }

  applyFilter(filterType: string, value: string) {
    if (filterType === 'country') this.country = value;

    this.router.navigate(['/category', 'movie', this.country, 'all', 'trending']);
  }

  movieGenres() {
    this.masterService.getMovieGenres().subscribe({
      next: (data: any) => {
        this.movieGenresData = data.genres;
      },
      error: (err: any) => {
        console.error('Error fetching movie genres:', err);
      }
    });
  }

  // Function to show Series details and redirect to details page
  navigateToTrendingMovies() {
    this.masterService.goToTrendingMovies();
  }

  navigateToTopImdbMovies() {
    this.masterService.goToTopImdbMovies();
  }

  goToMoviesByGenre(id: number) {
    this.router.navigate(['/category/genre'], {
      queryParams: {
        genre: id
      }
    });
  }


}
