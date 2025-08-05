import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pet } from '../../../interfaces/pet.interface';
import { PetService } from '../../../services/pet.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-family-pedigree',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './family-pedigree.component.html',
  styleUrl: './family-pedigree.component.css'
})
export class FamilyPedigreeComponent {
  pet!: Pet;
  petId: string = '';
  parents: Pet[] = [];
  children: Pet[] = [];
  loading = false;

  constructor(private petService: PetService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('petId');
    if (idFromRoute) {
      this.petId = idFromRoute;
      this.fetchPetAndFamily();
    }
  }

  private fetchPetAndFamily() {
    this.loading = true;

    this.petService.getById(this.petId).pipe(
      switchMap(pet => {
        this.pet = pet;

        const parents$ = this.fetchManyPets(pet.parents ?? []);
        const children$ = this.fetchManyPets(pet.children ?? []);

        return forkJoin([parents$, children$]);
      })
    ).subscribe({
      next: ([parents, children]) => {
        this.parents = parents;
        this.children = children;

        this.loading = false;
      },
      error: err => {
        console.error('Failed to load pet or family', err);
        this.loading = false;
      }
    });
  }

  private fetchManyPets(ids: string[]) {
    if (!ids?.length) return of([] as Pet[]);
    const unique = Array.from(new Set(ids));
    const calls = unique.map(id =>
      this.petService.getById(id).pipe(
        catchError(err => {
          console.error('Failed to load family member', id, err);
          return of(null as unknown as Pet);
        })
      )
    );
    return forkJoin(calls).pipe(
      map(list => list.filter(Boolean))
    );
  }
}
