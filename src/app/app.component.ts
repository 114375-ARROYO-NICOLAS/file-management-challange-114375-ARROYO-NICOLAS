import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileItem } from '../models/file.item.model';
import { FILE_LIST } from '../data/file.storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileOwner, FileType } from '../models/file.item.model';
import { OWNERS } from '../data/file.storage';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  files: FileItem[] = FILE_LIST;
  title = 'file-management';

  OWNERS = OWNERS;
  FileType = FileType;

  newItem: Partial<FileItem> = {
    owners: [],
    type: FileType.FILE,
    creation: new Date()
  };
  showNewItemForm: boolean = false;

  get sortedfiles(): FileItem[] {
    return [...this.files].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === FileType.FOLDER ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  get folders(): FileItem[] {
    return this.files.filter(item => item.type === FileType.FOLDER);
  }

  deleteSelected(): void {
    const selectedfiles = this.files.filter(item => (item as any).selected);
    if (selectedfiles.length > 1) {
      if (confirm(`¿Estás seguro de que quieres borrar ${selectedfiles.length} elementos?`)) {
        this.files = this.files.filter(item => !(item as any).selected);
      }
    } else if (selectedfiles.length === 1) {
      this.files = this.files.filter(item => !(item as any).selected);
    }
  }

  addNewItem(): void {
    if (this.newItem.name && this.newItem.creation && this.newItem.type !== undefined) {
      const newId = Math.max(...this.files.map(item => parseInt(item.id))) + 1;
      
      this.files.push({
        id: newId.toString(),
        name: this.newItem.name,
        type: this.newItem.type,
        creation: new Date(this.newItem.creation),
        owners: this.newItem.owners || [],
        parentId: this.newItem.parentId
      } as FileItem);

      this.newItem = {
        owners: [],
        type: FileType.FILE,
        creation: new Date()
      };
      this.showNewItemForm = false;
    }
  }

  toggleOwner(owner: FileOwner): void {
    const index = this.newItem.owners?.findIndex(o => o.name === owner.name);
    if (index !== undefined && index > -1) {
      this.newItem.owners?.splice(index, 1);
    } else {
      this.newItem.owners?.push(owner);
    }
  }

  isOwnerSelected(owner: FileOwner): boolean {
    return this.newItem.owners?.some(o => o.name === owner.name) || false;
  }
}