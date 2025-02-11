import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CsvService } from '../../services/csv.service';
import { SceneService } from '../../services/scene.service';

@Component({
  selector: 'app-browse-models',
  imports: [
    CommonModule, RouterLink, FormsModule, MatCardModule, MatGridListModule,
    MatIconModule, MatInputModule, InfiniteScrollModule
  ],
  templateUrl: './browse-models.component.html',
  styleUrl: './browse-models.component.scss'
})
export class BrowseModelsComponent implements OnInit {
  @ViewChild('gridContainer', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  loading: boolean = true;
  data: any[] = [];
  filterBy: string = '';
  thumbnails: { [key: string]: string } = {};
  displayedData: any[] = [];
  itemsPerPage: number = 12;
  currentPage: number = 1;
  gridCols: number = 3;

  constructor(
    private _csv: CsvService,
    private _scene: SceneService
  ) {}

  ngOnInit(): void {
    this._csv.parseCSV('test.csv').then((parsedData) => {
      this.data = parsedData;
      this.resizeGrid();
      this.loadMoreItems();
      this.loading = false;
    }).catch((error) => {
      console.log('Error parsing CSV file: ', error);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
      this.resizeGrid();
  }

  resizeGrid(): void {
    if (window.innerWidth <= 600) {
      console.log(window.innerWidth);
      this.gridCols = 1;
    } else if (window.innerWidth <= 900) {
      this.gridCols = 2;
    } else if (window.innerWidth <= 1200) {
      this.gridCols = 3;
    } else {
      this.gridCols = 4;
    }
  }

  filterData(): any[] {
    if (!this.filterBy) {
      return this.data;
    }
    return this.data.filter(item => item.title.toLowerCase().includes(this.filterBy.toLowerCase()));
  }

  generateThumbnails(models: any[]): void {
    const baseHref = ''; // Set the base href if needed
    models.forEach(model => {
      this._scene.generateThumbnail(model, baseHref).then(thumbnail => {
        this.thumbnails[model.filename] = thumbnail;
      }).catch(error => {
        console.log('Error generating thumbnail: ', error);
      });
    });
  }

  loadMoreItems(): void {
    const filteredData = this.filterData();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    const newItems = filteredData.slice(startIndex, endIndex);
    this.displayedData = [...this.displayedData, ...newItems];
    this.generateThumbnails(newItems); // Pass only the newly loaded items
    this.currentPage++;
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.displayedData = [];
    this.loadMoreItems();
  }
}