import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseModelsComponent } from './browse-models.component';

describe('BrowseModelsComponent', () => {
  let component: BrowseModelsComponent;
  let fixture: ComponentFixture<BrowseModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
