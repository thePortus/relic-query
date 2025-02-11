import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BrowseModelsComponent } from './components/browse-models/browse-models.component';
import { ViewModelComponent } from './components/view-model/view-model.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'items/:id', component: ViewModelComponent },
    { path: 'items', component: BrowseModelsComponent },
];
