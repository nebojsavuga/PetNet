import { Component } from '@angular/core';
import { PetService } from '../../../../services/pet.service';
import { ActivatedRoute } from '@angular/router';
import { Pet } from '../../../../interfaces/pet.interface';

@Component({
  selector: 'app-owner-data',
  standalone: true,
  imports: [],
  templateUrl: './owner-data.component.html',
  styleUrl: './owner-data.component.css'
})
export class OwnerDataComponent {
  pet!: Pet;
  petId: string = '';

  constructor(private petService: PetService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('petId');
    if (idFromRoute) {
      this.petId = idFromRoute;
      this.fetchPet();
    }
  }

  private fetchPet() {
    this.petService.getById(this.petId).subscribe({
      next: (pet) => (this.pet = pet),
      error: (err) => console.error('Failed to load pet', err),
    });
  }
}
