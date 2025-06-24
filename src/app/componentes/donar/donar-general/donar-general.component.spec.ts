import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonarGeneralComponent } from './donar-general.component';

describe('DonarGeneralComponent', () => {
  let component: DonarGeneralComponent;
  let fixture: ComponentFixture<DonarGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonarGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonarGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
