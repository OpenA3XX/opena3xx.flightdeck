import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-add-hardware-output-type-dialog',
    templateUrl: './add-hardware-output-type-dialog.component.html',
    styleUrls: ['./add-hardware-output-type-dialog.component.scss'],
    standalone: false
})
export class AddHardwareOutputTypeDialogComponent {
  addHardwareOutputTypeForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareOutputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  private initializeForm(): void {
    this.addHardwareOutputTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Output Type',
      subtitle: 'Create a new hardware output type configuration',
      icon: 'logout',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addHardwareOutputTypeForm.valid) {
      const formData: HardwareOutputTypeDto = {
        name: this.addHardwareOutputTypeForm.value.name
      };

      firstValueFrom(this.dataService.addHardwareOutputType(formData))
        .then(() => {
          this.snackBar.open('Hardware Output Type Saved Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware output type:', error);
          this.snackBar.open('Error has occurred when adding Hardware Output Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwareOutputTypeForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
