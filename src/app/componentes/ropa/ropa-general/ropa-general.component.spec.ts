import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RopaGeneralComponent } from './ropa-general.component';

describe('RopaGeneralComponent', () => {
  let component: RopaGeneralComponent;
  let fixture: ComponentFixture<RopaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RopaGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RopaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
