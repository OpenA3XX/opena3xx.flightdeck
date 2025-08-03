import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { HardwareOutputDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-delete-hardware-output-dialog-confirm',
    templateUrl: './delete-hardware-output-dialog.component.html',
    styleUrls: ['./delete-hardware-output-dialog.component.scss'],
    standalone: false
})
export class DeleteHardwareOutputDialogComponent {
  disabled: boolean = true;
  hardwareOutputName: string = '';
  wrapperConfig: DialogWrapperConfig;
  hardwareOutput: HardwareOutputDto;

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareOutputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareOutput: HardwareOutputDto },
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.hardwareOutput = data.hardwareOutput;
    this.hardwareOutputName = this.hardwareOutput.name;
    this.initializeWrapperConfig();
    this.updateWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Output',
      subtitle: 'Confirm deletion of hardware output',
      icon: 'delete',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareOutputName) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Delete ${this.hardwareOutputName}`,
        subtitle: 'This action cannot be undone'
      };
    }
  }

  onInputChange(target: HTMLInputElement) {
    this.disabled = target.value !== this.hardwareOutputName;
  }

  onConfirm(): void {
    if (this.hardwareOutput && this.hardwareOutput.id) {
      firstValueFrom(this.dataService.deleteHardwareOutput(this.hardwareOutput.id))
        .then(() => {
          this.snackBar.open('Hardware Output Deleted Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'deleted', data: this.hardwareOutput });
        })
        .catch((error) => {
          console.error('Error deleting hardware output:', error);
          this.snackBar.open('Error occurred while deleting Hardware Output', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.snackBar.open('Invalid hardware output data', 'Ok', {
        duration: 3000,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
