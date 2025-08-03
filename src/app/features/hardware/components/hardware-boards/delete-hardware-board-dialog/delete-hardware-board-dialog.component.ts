import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-board-dialog',
  templateUrl: './delete-hardware-board-dialog.component.html',
  styleUrls: ['./delete-hardware-board-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwareBoardDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwareBoard: HardwareBoardDto;
  disabled: boolean = true;
  hardwareBoardName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareBoard: HardwareBoardDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareBoard = data.hardwareBoard;
    this.hardwareBoardName = this.hardwareBoard.name;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Board',
      subtitle: `Are you sure you want to delete "${this.hardwareBoardName}"?`,
      icon: 'delete_forever',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onInputChange(target: HTMLInputElement) {
    this.disabled = target.value !== this.hardwareBoardName;
  }

  onConfirm(): void {
    if (this.hardwareBoard && this.hardwareBoard.id) {
      firstValueFrom(this.dataService.deleteHardwareBoard(this.hardwareBoard.id))
        .then(() => {
          this.snackBar.open('Hardware Board Deleted Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'deleted', data: this.hardwareBoard });
        })
        .catch((error) => {
          console.error('Error deleting hardware board:', error);
          this.snackBar.open('Error occurred while deleting Hardware Board', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.snackBar.open('Invalid hardware board data', 'Ok', {
        duration: 3000,
      });
    }
  }
}
