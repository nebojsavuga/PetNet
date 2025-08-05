import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadReportComponent } from './features/upload-report/upload-report.component';
import { PetPassportComponent } from './features/pet-passport/pet-passport.component';
import { OwnerDataComponent } from './features/pet-passport/owner-data/owner-data/owner-data.component';
import { AwardsComponent } from './features/pet-passport/awards/awards/awards.component';
import { VaccinesComponent } from './features/pet-passport/vaccines/vaccines.component';
import { FamilyPedigreeComponent } from './features/pet-passport/family-pedigree/family-pedigree.component';

export const routes: Routes = [
    { path: ':petId', component: UploadReportComponent },
    { path: 'passport/:petId', component: PetPassportComponent },
    { path: 'passport/:petId/owner', component: OwnerDataComponent },
    { path: 'passport/:petId/awards', component: AwardsComponent },
    { path: 'passport/:petId/vaccines', component: VaccinesComponent },
    { path: 'passport/:petId/family', component: FamilyPedigreeComponent },
];
