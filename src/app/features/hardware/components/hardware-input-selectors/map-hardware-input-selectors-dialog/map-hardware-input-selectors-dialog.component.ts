import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

interface FormData {
  identifier: number;
  [key: string]: unknown;
}

@Component({
    selector: 'opena3xx-map-hardware-input-selectors-dialog',
    templateUrl: './map-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./map-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class MapHardwareInputSelectorsDialogComponent {
  public hardwareInputSelector: any;
  public hardwareBoardSelectorFields: FieldConfig[] = [];
  dataLoaded: boolean = false;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MapHardwareInputSelectorsDialogComponent>
  ) {
    this.hardwareInputSelector = data;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Map Hardware Input Selectors',
      subtitle: 'Configure mapping for hardware input selectors',
      icon: 'link',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareInputSelector) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Map ${this.hardwareInputSelector.name} - ${this.hardwareInputSelector.hardwareInputType}`
      };
    }
  }

  submit(formData: FormData) {
    const index = _.find(this.hardwareInputSelector.hardwareInputSelectors, (o: any) => {
      return o.id === formData.identifier;
    });
    this._snackBar.open(
      `Mapping for ${this.hardwareInputSelector.name} => State ${index.name} saved successfully`,
      'Ok',
      {
        duration: 5000,
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
