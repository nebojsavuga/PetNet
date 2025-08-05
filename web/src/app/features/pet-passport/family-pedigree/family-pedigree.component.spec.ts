import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPedigreeComponent } from './family-pedigree.component';

describe('FamilyPedigreeComponent', () => {
  let component: FamilyPedigreeComponent;
  let fixture: ComponentFixture<FamilyPedigreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyPedigreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyPedigreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
