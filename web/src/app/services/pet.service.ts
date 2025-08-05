import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../interfaces/pet.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  apiServerUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiServerUrl}/pets/passport/${id}`);
  }
}
