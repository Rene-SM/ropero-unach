import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupacionesComponent } from './agrupaciones.component';

describe('AgrupacionesComponent', () => {
  let component: AgrupacionesComponent;
  let fixture: ComponentFixture<AgrupacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgrupacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgrupacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
