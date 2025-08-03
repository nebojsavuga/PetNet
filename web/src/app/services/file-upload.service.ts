import { Injectable } from '@angular/core';
import { ShdwDrive } from '@shadow-drive/sdk';
import { Connection, PublicKey } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private connection = new Connection('https://api.devnet.solana.com');

  constructor() { }
}
