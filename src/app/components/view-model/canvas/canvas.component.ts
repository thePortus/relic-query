import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasBox', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() data: any = {};

  constructor(
    private _scene: SceneService
  ) {}

  ngOnInit(): void {
    this._scene.initializeScene(
      this.canvasRef,
      document.getElementsByTagName('base')[0].href,
      this.data
    );
  }

  ngAfterViewInit(): void {
    this.resizeCanvas();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvasElement = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvasElement.width = width;
    canvasElement.height = height;

    this._scene.updateCameraProjection(this.canvasRef, width, height);
  }

}
