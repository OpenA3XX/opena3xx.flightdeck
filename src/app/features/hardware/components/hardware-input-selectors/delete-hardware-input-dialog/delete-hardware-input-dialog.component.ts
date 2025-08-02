import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HardwareInputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-delete-hardware-input-dialog-confirm',
    templateUrl: './delete-hardware-input-dialog.component.html',
    styleUrls: ['./delete-hardware-input-dialog.component.scss'],
    standalone: false
})
export class DeleteHardwareInputDialogComponent implements OnInit {
  disabled: boolean = true;
  hardwareInputName: string = '';
  wrapperConfig: DialogWrapperConfig;

  @Input() hardwareInput: HardwareInputDto;

  constructor(private dialogRef: MatDialogRef<DeleteHardwareInputDialogComponent>) {
    this.initializeWrapperConfig();
  }

  ngOnInit() {
    this.hardwareInputName = this.hardwareInput.name;
    this.updateWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Input',
      subtitle: 'Confirm deletion of hardware input',
      icon: 'delete',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareInputName) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Delete ${this.hardwareInputName}`,
        subtitle: 'This action cannot be undone'
      };
    }
  }

  onInputChange(target: HTMLInputElement) {
    this.disabled = target.value !== this.hardwareInputName;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
