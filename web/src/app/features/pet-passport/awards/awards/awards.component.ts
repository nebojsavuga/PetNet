import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pet } from '../../../../interfaces/pet.interface';
import { PetService } from '../../../../services/pet.service';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.css'
})
export class AwardsComponent {
  pet!: Pet;
  petId: string = '';

  constructor(private petService: PetService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('petId');
    if (idFromRoute) {
      this.petId = idFromRoute;
      this.fetchPet();
    }

    setTimeout(() => { console.log(this.pet) }, 200)
  }

  private fetchPet() {
    this.petService.getById(this.petId).subscribe({
      next: (pet) => (this.pet = pet),
      error: (err) => console.error('Failed to load pet', err),
    });
  }

  navigate(screen: string) {
    this.router.navigate([`passport/${this.petId}/${screen}`]);
  }
}
