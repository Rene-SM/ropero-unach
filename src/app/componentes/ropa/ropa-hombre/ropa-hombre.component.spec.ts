import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RopaHombreComponent } from './ropa-hombre.component';

describe('RopaHombreComponent', () => {
  let component: RopaHombreComponent;
  let fixture: ComponentFixture<RopaHombreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RopaHombreComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RopaHombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
