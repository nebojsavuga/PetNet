import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vaccine } from '../interfaces/vaccine.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  apiServerUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<Vaccine> {
    return this.http.get<Vaccine>(`${this.apiServerUrl}/vaccines/getById/${id}`);
  }

}
