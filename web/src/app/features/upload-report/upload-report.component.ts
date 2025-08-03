import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DotLottie } from '@lottiefiles/dotlottie-web';


@Component({
  selector: 'app-upload-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-report.component.html',
  styleUrl: './upload-report.component.css'
})
export class UploadReportComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('lottieCanvas', { static: false }) lottieCanvas!: ElementRef;

  petIdFromRoute: string | null = null;

  isDragging = false;
  selectedFile: File | null = null;
  selectedType: string = 'vaccination';
  walletAddress: string | null = null;
  interventionName: string = '';
  clinicName: string = '';
  uploading: boolean = false;
  uploaded: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.petIdFromRoute = params.get('petId');
      console.log('petIdFromRoute:', this.petIdFromRoute);
      if (this.petIdFromRoute) this.connectWallet();
    });
  }

  async connectWallet(): Promise<string | null> {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        return resp.publicKey.toString();
      } catch (err) {
        console.error('User rejected the connection');
        return null;
      }
    } else {
      alert('Please install Phantom Wallet');
      return null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please drop a valid PDF file.');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please select a valid PDF file.');
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    console.log('Uploading', this.selectedFile);
  }

  uploadInterventionPdf() {
    if (!this.selectedFile) return;
    if (!this.petIdFromRoute) {
      alert('Missing petId in URL');
      return;
    }

    this.uploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('petId', this.petIdFromRoute);
    formData.append('clinicName', this.clinicName);
    formData.append('interventionName', this.interventionName);

    console.log(formData.get('petId'));
    console.log(formData.get('clinicName'));
    console.log(formData.get('interventionName'));

    this.http.post<any>('http://localhost:3000/api/pets/upload-pdf', formData)
      .subscribe({
        next: (res) => {
          console.log('PDF uploaded:', res);
          this.uploading = false
          this.uploaded = true;
          setTimeout(() => {
            const dotLottie = new DotLottie({
              autoplay: true,
              loop: false,
              canvas: this.lottieCanvas.nativeElement,
              src: '../../../assets/SuccessAnimation.json',
            });
          }, 50);

          setTimeout(() => { this.uploaded = false }, 3000)
        },
        error: (err) => {
          console.error('PDF upload failed:', err);
        }
      });
  }
}
