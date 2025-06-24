import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RopaMujerGeneralComponent } from './ropa-mujer-general.component';

describe('RopaMujerGeneralComponent', () => {
  let component: RopaMujerGeneralComponent;
  let fixture: ComponentFixture<RopaMujerGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RopaMujerGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RopaMujerGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
