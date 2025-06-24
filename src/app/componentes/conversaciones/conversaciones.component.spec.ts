import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversacionesComponent } from './conversaciones.component';

describe('ConversacionesComponent', () => {
  let component: ConversacionesComponent;
  let fixture: ComponentFixture<ConversacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
