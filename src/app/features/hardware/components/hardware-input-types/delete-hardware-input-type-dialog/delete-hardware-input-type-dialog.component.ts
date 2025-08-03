import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-input-type-dialog',
  templateUrl: './delete-hardware-input-type-dialog.component.html',
  styleUrls: ['./delete-hardware-input-type-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwareInputTypeDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwareInputType: HardwareInputTypeDto;
  disabled: boolean = true;
  hardwareInputTypeName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareInputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareInputType: HardwareInputTypeDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareInputType = data.hardwareInputType;
    this.hardwareInputTypeName = this.hardwareInputType.name;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Input Type',
      subtitle: `Are you sure you want to delete "${this.hardwareInputTypeName}"?`,
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
    this.disabled = target.value !== this.hardwareInputTypeName;
  }

  onConfirm(): void {
    if (this.hardwareInputType && this.hardwareInputType.id) {
      firstValueFrom(this.dataService.deleteHardwareInputType(this.hardwareInputType.id))
        .then(() => {
          this.snackBar.open('Hardware Input Type Deleted Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'deleted', data: this.hardwareInputType });
        })
        .catch((error) => {
          console.error('Error deleting hardware input type:', error);
          this.snackBar.open('Error occurred while deleting Hardware Input Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.snackBar.open('Invalid hardware input type data', 'Ok', {
        duration: 3000,
      });
    }
  }
}
