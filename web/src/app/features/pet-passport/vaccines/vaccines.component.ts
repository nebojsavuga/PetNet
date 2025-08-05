import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pet } from '../../../interfaces/pet.interface';
import { PetService } from '../../../services/pet.service';
import { VaccineService } from '../../../services/vaccine.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Vaccine } from '../../../interfaces/vaccine.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vaccines',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vaccines.component.html',
  styleUrl: './vaccines.component.css'
})
export class VaccinesComponent {
  pet!: Pet;
  petId: string = '';
  vaccines: Vaccine[] = [];
  loading = false;

  constructor(private petService: PetService,
    private router: Router,
    private vaccineService: VaccineService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('petId');
    if (idFromRoute) {
      this.petId = idFromRoute;
      this.fetchPetAndVaccines();
    }
  }

  private fetchPetAndVaccines() {
    this.loading = true;

    this.petService.getById(this.petId).pipe(
      switchMap((pet: Pet) => {
        this.pet = pet;

        const vaccinations = pet?.vaccinations ?? [];
        if (vaccinations.length === 0) return of([] as Vaccine[]);

        const uniqueIds = Array.from(new Set(vaccinations.map(v => v.vaccine)));

        const calls = uniqueIds.map(id =>
          this.vaccineService.getById(id).pipe(
            catchError(err => {
              console.error('Neuspešno učitavanje vakcine', id, err);
              return of(null);
            })
          )
        );

        return forkJoin(calls).pipe(
          map(results => results.filter((v): v is Vaccine => v !== null))
        );
      }),
      catchError(err => {
        console.error('Failed to load pet', err);
        return of([] as Vaccine[]);
      })
    )
      .subscribe({
        next: (vaccines) => {
          this.vaccines = vaccines;
          console.log(this.vaccines);
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }


  nextDate(updatedAt: string, days: number): Date {
    const d = new Date(updatedAt);
    d.setDate(d.getDate() + (Number.isFinite(days) ? days : 0));
    return d;
  }

  isDone(updatedAt: string, days: number): boolean {
    const next = this.nextDate(updatedAt, days);
    if (!next) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextD = new Date(next);
    nextD.setHours(0, 0, 0, 0);

    return nextD.getTime() > today.getTime();
  }
}
