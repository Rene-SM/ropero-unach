import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoriosGeneralComponent } from './accesorios-general.component';

describe('AccesoriosGeneralComponent', () => {
  let component: AccesoriosGeneralComponent;
  let fixture: ComponentFixture<AccesoriosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoriosGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesoriosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
