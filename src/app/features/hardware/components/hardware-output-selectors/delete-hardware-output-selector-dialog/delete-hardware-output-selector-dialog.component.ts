import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputDto, HardwareOutputSelectorDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-output-selector-dialog',
  templateUrl: './delete-hardware-output-selector-dialog.component.html',
  styleUrls: ['./delete-hardware-output-selector-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwareOutputSelectorDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwareOutput: HardwareOutputDto;
  selector: HardwareOutputSelectorDto;
  disabled: boolean = true;
  selectorName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareOutputSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareOutput: HardwareOutputDto, selector: HardwareOutputSelectorDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareOutput = data.hardwareOutput;
    this.selector = data.selector;
    this.selectorName = this.selector.name;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Output Selector',
      subtitle: `Are you sure you want to delete "${this.selectorName}"?`,
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
    this.disabled = target.value !== this.selectorName;
  }

  onConfirm(): void {
    firstValueFrom(this.dataService.deleteHardwareOutputSelector(this.hardwareOutput.id, this.selector.id))
      .then(() => {
        this.snackBar.open('Hardware Output Selector Deleted Successfully', 'Ok', {
          duration: 3000,
        });
        this.dialogRef.close({ action: 'deleted', data: this.selector });
      })
      .catch((error) => {
        console.error('Error deleting hardware output selector:', error);
        this.snackBar.open('Error occurred while deleting Hardware Output Selector', 'Ok', {
          duration: 3000,
        });
      });
  }
}
