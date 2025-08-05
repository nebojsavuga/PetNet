import { Component, OnInit } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pet } from '../../interfaces/pet.interface';

@Component({
  selector: 'app-pet-passport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-passport.component.html',
  styleUrl: './pet-passport.component.css'
})
export class PetPassportComponent implements OnInit {

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
