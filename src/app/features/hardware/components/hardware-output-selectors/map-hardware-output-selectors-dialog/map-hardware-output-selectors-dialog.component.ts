import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HardwareOutputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-map-hardware-output-selectors-dialog',
    templateUrl: './map-hardware-output-selectors-dialog.component.html',
    styleUrls: ['./map-hardware-output-selectors-dialog.component.scss'],
    standalone: false
})
export class MapHardwareOutputSelectorsDialogComponent {
  public hardwareOutputSelector: any;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto },
    private dialogRef: MatDialogRef<MapHardwareOutputSelectorsDialogComponent>
  ) {
    this.hardwareOutputSelector = data;
    console.log('Dialog Component', data);
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Map Hardware Output Selectors',
      subtitle: 'Configure mapping for hardware output selectors',
      icon: 'link',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareOutputSelector) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Map ${this.hardwareOutputSelector.name} - ${this.hardwareOutputSelector.hardwareOutputType}`
      };
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
