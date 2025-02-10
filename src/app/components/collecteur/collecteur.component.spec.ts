import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollecteurComponent } from './collecteur.component';

describe('CollecteurComponent', () => {
  let component: CollecteurComponent;
  let fixture: ComponentFixture<CollecteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollecteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
