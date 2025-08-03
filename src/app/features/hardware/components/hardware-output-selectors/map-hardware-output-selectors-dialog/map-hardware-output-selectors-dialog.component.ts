import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

interface FormData {
  identifier: number;
  [key: string]: unknown;
}

@Component({
    selector: 'opena3xx-map-hardware-output-selectors-dialog',
    templateUrl: './map-hardware-output-selectors-dialog.component.html',
    styleUrls: ['./map-hardware-output-selectors-dialog.component.scss'],
    standalone: false
})
export class MapHardwareOutputSelectorsDialogComponent {
  public hardwareOutputSelector: any;
  public hardwareBoardSelectorFields: FieldConfig[] = [];
  dataLoaded: boolean = false;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto },
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MapHardwareOutputSelectorsDialogComponent>
  ) {
    this.hardwareOutputSelector = data;
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

  submit(formData: FormData) {
    const index = _.find(this.hardwareOutputSelector.hardwareOutputSelectors, (o: any) => {
      return o.id === formData.identifier;
    });
    this._snackBar.open(
      `Mapping for ${this.hardwareOutputSelector.name} => State ${index.name} saved successfully`,
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
