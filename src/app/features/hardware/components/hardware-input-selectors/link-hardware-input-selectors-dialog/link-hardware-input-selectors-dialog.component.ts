import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HardwareInputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: './link-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./link-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class LinkHardwareInputSelectorsDialogComponent {
  public hardwareInputSelector: any;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dialogRef: MatDialogRef<LinkHardwareInputSelectorsDialogComponent>
  ) {
    this.hardwareInputSelector = data;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Link Hardware Input Selectors',
      subtitle: 'Configure linking for hardware input selectors',
      icon: 'laptop',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareInputSelector) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Link ${this.hardwareInputSelector.name} - ${this.hardwareInputSelector.hardwareInputType}`
      };
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
