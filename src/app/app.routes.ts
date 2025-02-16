import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { HomeComponent } from './home/home.component';
import { SeriesDetailsComponent } from './series-details/series-details.component';
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'movie-details/:id', component: MovieDetailsComponent },
    { path: 'series-details/:id', component: SeriesDetailsComponent },
    { path: 'category/:type/:country/:year/:sort', component: CategoryComponent },
    { path: 'category/search', component: CategoryComponent },
    { path: 'category/genre', component: CategoryComponent },
    // { path: 'category/:type/:filter/:movieID', component: CategoryComponent }, // For specific movie/TV show details
    // { path: 'movie-details', component: MovieDetailsComponent },
];
