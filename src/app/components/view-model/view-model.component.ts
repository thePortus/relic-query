import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { CsvService } from '../../services/csv.service';

import { CanvasComponent } from './canvas/canvas.component';
import { LightControlComponent } from './light-control/light-control.component';

@Component({
  selector: 'app-view-model',
  imports: [
    CommonModule, RouterLink, MatSidenavModule, MatExpansionModule, MatIconModule,
    MatProgressBarModule, LightControlComponent, MatButtonModule, CanvasComponent],
  templateUrl: './view-model.component.html',
  styleUrl: './view-model.component.scss'
})
export class ViewModelComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  modelId: string = '';
  data: any = {};
  loading: boolean = true;
  showControls: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _csv: CsvService
  ) {}

  ngOnInit() : void {
    this.modelId = this._route.snapshot.paramMap.get('id') ?? '';
    this._csv.getRecord('test.csv', this.modelId).then(modelData => {
      this.data = modelData;
      this.loading = false;
    }).catch(error => {
      console.error('Error parsing CSV file:', error);
    });
  }

  toggleSideNav() {
    this.showControls = !this.showControls;
    if (this.showControls) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }
}
