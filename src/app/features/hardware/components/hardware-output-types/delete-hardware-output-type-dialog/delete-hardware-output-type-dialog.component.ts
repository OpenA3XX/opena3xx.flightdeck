import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-output-type-dialog',
  templateUrl: './delete-hardware-output-type-dialog.component.html',
  styleUrls: ['./delete-hardware-output-type-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwareOutputTypeDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwareOutputType: HardwareOutputTypeDto;
  disabled: boolean = true;
  hardwareOutputTypeName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareOutputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareOutputType: HardwareOutputTypeDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareOutputType = data.hardwareOutputType;
    this.hardwareOutputTypeName = this.hardwareOutputType.name;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Output Type',
      subtitle: `Are you sure you want to delete "${this.hardwareOutputTypeName}"?`,
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
    this.disabled = target.value !== this.hardwareOutputTypeName;
  }

  onConfirm(): void {
    if (this.hardwareOutputType && this.hardwareOutputType.id) {
      firstValueFrom(this.dataService.deleteHardwareOutputType(this.hardwareOutputType.id))
        .then(() => {
          this.snackBar.open('Hardware Output Type Deleted Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'deleted', data: this.hardwareOutputType });
        })
        .catch((error) => {
          console.error('Error deleting hardware output type:', error);
          this.snackBar.open('Error occurred while deleting Hardware Output Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.snackBar.open('Invalid hardware output type data', 'Ok', {
        duration: 3000,
      });
    }
  }
}
