import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface AmbientLightInfo {
  intensity: number;
  color: number;
}

interface LightInfo {
  intensity: number;
  color: number;
  x: number;
  y: number;
  z: number;
}

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private model: any;
  private controls: any;

  ambientLightInfo: AmbientLightInfo = {
    intensity: 100,
    color: 0x000000
  };

  directionalLightInfo: LightInfo = {
    intensity: 0.4,
    color: 0xffdf04,
    x: -4,
    y: 4,
    z: 0
  };

  light1Info: LightInfo = {
    intensity: 0.35,
    color: 0xffffff,
    x: 0,
    y: 200,
    z: 400
  };

  light2Info: LightInfo = {
    intensity: 0.35,
    color: 0xffffff,
    x: 500,
    y: 100,
    z: 0
  };

  light3Info: LightInfo = {
    intensity: 0.35,
    color: 0xffffff,
    x: 0,
    y: 100,
    z: 500
  };

  light4Info: LightInfo = {
    intensity: 0.35,
    color: 0xffffff,
    x: -500,
    y: 300,
    z: 500
  };

  hemisphereLightInfo: any = {
    skyColor: 0xffeeb1,
    groundColor: 0x080820,
    intensity: 1
  };

  private directionalLight!: THREE.DirectionalLight;
  private light1!: THREE.PointLight;
  private light2!: THREE.PointLight;
  private light3!: THREE.PointLight;
  private light4!: THREE.PointLight;
  private hemisphereLight!: THREE.HemisphereLight;

  constructor() {}

  initializeScene(canvas: ElementRef<HTMLCanvasElement>, baseHref:string, modelInfo: any) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.nativeElement.clientWidth / canvas.nativeElement.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.nativeElement, antialias: true });
    this.renderer.setSize(canvas.nativeElement.clientWidth, canvas.nativeElement.clientHeight);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.enableDamping = true;

    this.camera.position.z = 10;
    if (modelInfo.pan_out) {
      this.camera.position.z = modelInfo.pan_out;
    }
    this.camera.zoom *= modelInfo.zoom_level;
    this.camera.updateProjectionMatrix();

    this.controls.update();
    this.loadModel(modelInfo, baseHref);
    this.addLights();
    this.setBackgroundColor(0xEEEEEE);

    this.startRenderingLoop();
  }

  setBackgroundColor(color: any) {
    this.scene.background = new THREE.Color(color);
  }

  updateCameraProjection(canvas: ElementRef<HTMLCanvasElement>, width: number, height: number) {
    console.log('Resizing canvas to: ', width, height);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private convertDegreesToDecimal(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  private loadModel(modelInfo: any, baseHref: string) {
    let loader: any;
    if (modelInfo.filename.endsWith('.stl')) {
      loader = new STLLoader();
    } else if (modelInfo.filename.endsWith('.obj')) {
      loader = new OBJLoader();
    } else if (modelInfo.filename.endsWith('.glb') || modelInfo.filename.endsWith('.gltf')) {
      loader = new GLTFLoader();
    }

    const modelPath = baseHref + 'models/' + modelInfo.filename;
    loader.load(modelPath, (object: any) => {
      if (modelInfo.filename.endsWith('.stl')) {
        const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
        this.model = new THREE.Mesh(object, material);
      } else if (modelInfo.filename.endsWith('.obj')) {
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x606060 });
          }
        });
        this.model = object;
      } else {
        this.model = object.scene;
      }

      // Calculate the bounding box of the model
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());

      // Position model in box and perform rotations
      this.model.position.sub(center);
      this.camera.rotation.order = 'XYZ';
      this.model.rotation.set(
        this.convertDegreesToDecimal(modelInfo.rotation_x),
        this.convertDegreesToDecimal(modelInfo.rotation_y),
        this.convertDegreesToDecimal(modelInfo.rotation_z)
      );
      this.scene.add(this.model);
      this.camera.lookAt(center);
    });
    
  }

  private addLights() {
    this.hemisphereLight = new THREE.HemisphereLight(this.hemisphereLightInfo.skyColor, this.hemisphereLightInfo.groundColor, this.hemisphereLightInfo.intensity);
    this.scene.add(this.hemisphereLight);

    this.directionalLight = new THREE.DirectionalLight(this.directionalLightInfo.color, this.directionalLightInfo.intensity);
    this.directionalLight.position.set(this.directionalLightInfo.x, this.directionalLightInfo.y, this.directionalLightInfo.z);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.bias = -0.0001;
    this.directionalLight.shadow.mapSize.height = 1024 * 4;
    this.directionalLight.shadow.mapSize.width = 1024 * 4;
    this.scene.add(this.directionalLight);

    this.light1 = new THREE.PointLight(this.light1Info.color, this.light1Info.intensity);
    this.light1.castShadow = true;
    this.light1.shadow.bias = -0.0001;
    this.light1.shadow.mapSize.height = 1024 * 4;
    this.light1.shadow.mapSize.width = 1024 * 4;
    this.light1.position.set(this.light1Info.x, this.light1Info.y, this.light1Info.z);
    this.scene.add(this.light1);

    this.light2 = new THREE.PointLight(this.light2Info.color, this.light2Info.intensity);
    this.light2.castShadow = true;
    this.light2.shadow.bias = -0.0001;
    this.light2.shadow.mapSize.height = 1024 * 4;
    this.light2.shadow.mapSize.width = 1024 * 4;
    this.light2.position.set(this.light2Info.x, this.light2Info.y, this.light2Info.z);
    this.scene.add(this.light2);

    this.light3 = new THREE.PointLight(this.light3Info.color, this.light3Info.intensity);
    this.light3.castShadow = true;
    this.light3.shadow.bias = -0.0001;
    this.light3.shadow.mapSize.height = 1024 * 4;
    this.light3.shadow.mapSize.width = 1024 * 4;
    this.light3.position.set(this.light3Info.x, this.light3Info.y, this.light3Info.z);
    this.scene.add(this.light3);

    this.light4 = new THREE.PointLight(this.light4Info.color, this.light4Info.intensity);
    this.light4.castShadow = true;
    this.light4.shadow.bias = -0.0001;
    this.light4.shadow.mapSize.height = 1024 * 4;
    this.light4.shadow.mapSize.width = 1024 * 4;
    this.light4.position.set(this.light4Info.x, this.light4Info.y, this.light4Info.z);
    this.scene.add(this.light4);
  }

  private startRenderingLoop() {
    const component = this;
    (function render() {
      requestAnimationFrame(render);
      component.controls.update();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  setDirectionalLightStrength(intensity: number) {
    this.directionalLightInfo.intensity = intensity;
    this.scene.remove(this.directionalLight);
    this.directionalLight = new THREE.DirectionalLight(this.directionalLightInfo.color, this.directionalLightInfo.intensity);
    this.scene.add(this.directionalLight);
  }

  setHemisphereLight(info: { skyColor: number, groundColor: number, intensity: number }) {
    if (this.hemisphereLight) {
      this.scene.remove(this.hemisphereLight);
    }
    this.hemisphereLight = new THREE.HemisphereLight(info.skyColor, info.groundColor, info.intensity);
    this.scene.add(this.hemisphereLight);
  }

  generateThumbnail(modelInfo: any, baseHref: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      scene.background = new THREE.Color(0xEEEEEE);
      renderer.setSize(256, 256);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 2.3;
  
      camera.position.z = 10;
      if (modelInfo.pan_out) {
        camera.position.z = modelInfo.pan_out;
      }
      camera.zoom *= modelInfo.zoom_level;
      camera.updateProjectionMatrix();
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10).normalize();
      scene.add(directionalLight);

      let loader: any;
      if (modelInfo.filename.endsWith('.stl')) {
        loader = new STLLoader();
      } else if (modelInfo.filename.endsWith('.obj')) {
        loader = new OBJLoader();
      } else if (modelInfo.filename.endsWith('.glb') || modelInfo.filename.endsWith('.gltf')) {
        loader = new GLTFLoader();
      }
      const modelPath = baseHref + 'models/' + modelInfo.filename;
      loader.load(modelPath, (object: any) => {
        let model;
        if (modelInfo.filename.endsWith('.stl')) {
          const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
          model = new THREE.Mesh(object, material);
        } else if (modelInfo.filename.endsWith('.obj')) {
          object.traverse((child: any) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x606060 });
            }
          });
          model = object;
        } else {
          model = object.scene;
        }
        camera.rotation.order = 'XYZ';
        model.rotation.set(
          this.convertDegreesToDecimal(modelInfo.rotation_x),
          this.convertDegreesToDecimal(modelInfo.rotation_y),
          this.convertDegreesToDecimal(modelInfo.rotation_z)
        );
        scene.add(model);
  
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        camera.lookAt(center);
  
        renderer.render(scene, camera);
        const thumbnail = renderer.domElement.toDataURL();
        resolve(thumbnail);
      }, undefined, (error: any) => {
        reject(error);
      });
    });
  }
}