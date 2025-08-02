import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-add-hardware-input-type-dialog',
    templateUrl: './add-hardware-input-type-dialog.component.html',
    styleUrls: ['./add-hardware-input-type-dialog.component.scss'],
    standalone: false
})
export class AddHardwareInputTypeDialogComponent {
  addHardwareInputTypeForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareInputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  private initializeForm(): void {
    this.addHardwareInputTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Input Type',
      subtitle: 'Create a new hardware input type configuration',
      icon: 'login',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addHardwareInputTypeForm.valid) {
      const formData: HardwareInputTypeDto = {
        name: this.addHardwareInputTypeForm.value.name
      };

      firstValueFrom(this.dataService.addHardwareInputType(formData))
        .then(() => {
          this.snackBar.open('Hardware Input Type Saved Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware input type:', error);
          this.snackBar.open('Error has occurred when adding Hardware Input Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwareInputTypeForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
