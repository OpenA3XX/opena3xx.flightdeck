import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-register-hardware-board-dialog',
    templateUrl: './register-hardware-board-dialog.component.html',
    styleUrls: ['./register-hardware-board-dialog.component.scss'],
    standalone: false
})
export class RegisterHardwareBoardDialogComponent {
  registerHardwareBoardForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  totalDiscreteInputOutput: number;

  boardNameFieldConfig: FieldConfig = {
    hint: 'Enter the name of the new Hardware Board',
    inputType: 'text',
    label: 'Name',
    name: 'name',
    type: 'input',
    validations: [
      {
        message: 'Hardware Board Name is Required',
        name: 'required',
        validator: Validators.required,
      },
    ],
  };

  totalExtendersFieldConfig: FieldConfig = {
    hint: 'Select Total Extenders (MCP23017)',
    label: 'Total I²C Extenders on board',
    maxValue: '8',
    minValue: '1',
    name: 'hardwareBusExtendersCount',
    stepValue: '1',
    type: 'slider',
    value: 1,
  };

  constructor(
    private dialogRef: MatDialogRef<RegisterHardwareBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
    this.totalDiscreteInputOutput = 16; // Default
  }

  private initializeForm(): void {
    this.registerHardwareBoardForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      hardwareBusExtendersCount: [1, [Validators.required]],
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Register Hardware Board',
      subtitle: 'Register a new hardware board configuration',
      icon: 'developer_board',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.registerHardwareBoardForm.valid) {
      const formData = this.registerHardwareBoardForm.value;

      firstValueFrom(this.dataService.addHardwareBoards(formData))
        .then(() => {
          this.snackBar.open('Hardware Board Registered Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error registering hardware board:', error);
          this.snackBar.open('Error occurred while registering Hardware Board', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.registerHardwareBoardForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  onSliderValueChange(value: number): void {
    this.totalDiscreteInputOutput = value * 16;
  }
}
