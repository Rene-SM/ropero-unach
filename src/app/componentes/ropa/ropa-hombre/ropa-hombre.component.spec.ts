import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RopaHombreGeneralComponent } from './ropa-hombre.component';

describe('RopaHombreGeneralComponent', () => {
  let component: RopaHombreGeneralComponent;
  let fixture: ComponentFixture<RopaHombreGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RopaHombreGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RopaHombreGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
