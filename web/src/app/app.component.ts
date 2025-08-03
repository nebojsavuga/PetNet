import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

declare global {
  interface Window {
    solana?: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PetNet';

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  isDragging = false;
  selectedFile: File | null = null;
  selectedType: string = 'vaccination';
  walletAddress: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.connectWallet();
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

  uploadInterventionPdf(petId: string) {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('petId', petId);

    this.http.post<any>('http://localhost:3000/api/pets/upload-pdf', formData)
      .subscribe({
        next: (res) => {
          console.log('PDF uploaded:', res);
          alert('Intervention report uploaded to IPFS!');
        },
        error: (err) => {
          console.error('PDF upload failed:', err);
        }
      });
  }
}
