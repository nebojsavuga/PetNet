import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadReportComponent } from './features/upload-report/upload-report.component';

export const routes: Routes = [
    { path: ':petId', component: UploadReportComponent },
];
