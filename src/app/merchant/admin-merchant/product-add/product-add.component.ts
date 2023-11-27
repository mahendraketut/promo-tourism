import { Component } from '@angular/core';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  coverPreviews: { url: string; fileName: string }[] = [];
  imagePreviews: { url: string; fileName: string }[] = [];

  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.coverPreviews = []; // Clear existing previews

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const fileName = selectedFile.name;

        // Read and display image preview
        const reader = new FileReader();
        reader.onload = () => {
          const previewURL = reader.result as string;
          this.coverPreviews.push({ url: previewURL, fileName });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.imagePreviews = []; // Clear existing previews

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const fileName = selectedFile.name;

        // Read and display image preview
        const reader = new FileReader();
        reader.onload = () => {
          const previewURL = reader.result as string;
          this.imagePreviews.push({ url: previewURL, fileName });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  }

  showFileDetails(file: File): void {
    // Display file details as needed, e.g., file name, size, type
    console.log(
      `Selected File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
    );
  }

  getFileNameFromURL(url: string): string {
    // Extract file name from URL
    const startIndex = url.lastIndexOf('/') + 1;
    const endIndex =
      url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.length;
    return url.substring(startIndex, endIndex);
  }

  getFileSizeFromURL(url: string): string {
    // Extract file size from URL
    const sizeInBytes = url.length * 0.75; // Approximate size calculation
    const sizeInKb = sizeInBytes / 1024;
    return `${sizeInKb.toFixed(2)} KB`;
  }

  // Method to reset image previews
  resetImagePreviews(): void {
    this.imagePreviews = [];
    this.coverPreviews = [];
  }
}
