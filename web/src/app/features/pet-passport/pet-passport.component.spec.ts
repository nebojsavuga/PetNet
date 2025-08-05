import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPassportComponent } from './pet-passport.component';

describe('PetPassportComponent', () => {
  let component: PetPassportComponent;
  let fixture: ComponentFixture<PetPassportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetPassportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
