import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';

import { ColorPickerModule } from 'ngx-color-picker';

import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-light-control',
  imports: [CommonModule, MatSliderModule, MatButtonModule, MatIconModule, ColorPickerModule],
  templateUrl: './light-control.component.html',
  styleUrl: './light-control.component.scss'
})
export class LightControlComponent implements OnInit {
  @Input() light: any = {};
  @Input() type: string = 'directional';

  isOpen: boolean = false;

  constructor(private _scene: SceneService) {}

  ngOnInit(): void {
    this.initializeLight();
  }

  initializeLight() {
    if (!this.light) {
      switch (this.type) {
        case 'ambient':
          this.light = { color: 0xffffff, intensity: 1 };
          break;
        case 'directional':
          this.light = { color: 0xffffff, intensity: 1, x: 0, y: 0, z: 0 };
          break;
        case 'hemisphere':
          this.light = { skyColor: 0xffffff, groundColor: 0x000000, intensity: 1 };
          break;
        case 'point':
          this.light = { color: 0xffffff, intensity: 1, x: 0, y: 0, z: 0 };
          break;
      }
    }
  }

  changeLight(property: string, e: any) {
    this.light[property] = e.target.value;
    this.updateLightInScene();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  hexColorToDecimal(property: string = 'color', hex: string): void {
    this.light[property] = parseInt(hex.replace('#', ''), 16);
    this.updateLightInScene();
  }

  decimalToHexColor(decimal: number): string {
    return '#' + decimal.toString(16).padStart(6, '0');
  }

  private updateLightInScene() {
    switch (this.type) {
      //case 'ambient':
      //  this._scene.setAmbientLight(this.light);
      //  break;
      //case 'directional':
      //  this._scene.setDirectionalLight(this.light);
      //  break;
      case 'hemisphere':
        this._scene.setHemisphereLight(this.light);
        break;
      //case 'point':
      //  this._scene.setPointLights([this.light]);
      //  break;
    }
  }
}