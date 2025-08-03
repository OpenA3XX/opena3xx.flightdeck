import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputDto, HardwareInputSelectorDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-input-selector-dialog',
  templateUrl: './delete-hardware-input-selector-dialog.component.html',
  styleUrls: ['./delete-hardware-input-selector-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwareInputSelectorDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwareInput: HardwareInputDto;
  selector: HardwareInputSelectorDto;
  disabled: boolean = true;
  selectorName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwareInputSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareInput: HardwareInputDto, selector: HardwareInputSelectorDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareInput = data.hardwareInput;
    this.selector = data.selector;
    this.selectorName = this.selector.name;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Input Selector',
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
    firstValueFrom(this.dataService.deleteHardwareInputSelector(this.hardwareInput.id, this.selector.id))
      .then(() => {
        this.snackBar.open('Hardware Input Selector Deleted Successfully', 'Ok', {
          duration: 3000,
        });
        this.dialogRef.close({ action: 'deleted', data: this.selector });
      })
      .catch((error) => {
        console.error('Error deleting hardware input selector:', error);
        this.snackBar.open('Error occurred while deleting Hardware Input Selector', 'Ok', {
          duration: 3000,
        });
      });
  }
}
