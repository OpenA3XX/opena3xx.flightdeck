import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { AddHardwareInputSelectorDto, HardwareInputDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-add-hardware-input-selector-dialog',
  templateUrl: './add-hardware-input-selector-dialog.component.html',
  styleUrls: ['./add-hardware-input-selector-dialog.component.scss'],
  standalone: false
})
export class AddHardwareInputSelectorDialogComponent {
  addSelectorForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwareInput: HardwareInputDto;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareInputSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareInput: HardwareInputDto },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwareInput = data.hardwareInput;
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  private initializeForm(): void {
    this.addSelectorForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Input Selector',
      subtitle: `Add a new selector for "${this.hardwareInput.name}"`,
      icon: 'add_circle',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addSelectorForm.valid) {
      const formData: AddHardwareInputSelectorDto = {
        name: this.addSelectorForm.value.name
      };

      firstValueFrom(this.dataService.addHardwareInputSelector(this.hardwareInput.id, formData))
        .then(() => {
          this.snackBar.open('Hardware Input Selector Added Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware input selector:', error);
          this.snackBar.open('Error occurred while adding Hardware Input Selector', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addSelectorForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
