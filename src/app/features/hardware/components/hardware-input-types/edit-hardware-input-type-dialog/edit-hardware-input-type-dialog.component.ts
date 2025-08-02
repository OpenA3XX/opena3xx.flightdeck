import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-edit-hardware-input-type-dialog',
    templateUrl: './edit-hardware-input-type-dialog.component.html',
    styleUrls: ['./edit-hardware-input-type-dialog.component.scss'],
    standalone: false
})
export class EditHardwareInputTypeDialogComponent implements OnInit {
  editHardwareInputTypeForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwareInputType: HardwareInputTypeDto | null = null;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<EditHardwareInputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  ngOnInit(): void {
    this.loadHardwareInputType();
  }

  private initializeForm(): void {
    this.editHardwareInputTypeForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Edit Hardware Input Type',
      subtitle: 'Update hardware input type configuration',
      icon: 'edit',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  private loadHardwareInputType(): void {
    this.loading = true;
    firstValueFrom(this.dataService.getHardwareInputTypeById(this.data.id))
      .then((data) => {
        this.hardwareInputType = data as HardwareInputTypeDto;
        this.editHardwareInputTypeForm.patchValue({
          id: this.hardwareInputType.id,
          name: this.hardwareInputType.name
        });
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error loading hardware input type:', error);
        this.snackBar.open('Error loading hardware input type', 'Close', {
          duration: 3000
        });
        this.loading = false;
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editHardwareInputTypeForm.valid) {
      const formData: HardwareInputTypeDto = {
        id: this.editHardwareInputTypeForm.value.id,
        name: this.editHardwareInputTypeForm.value.name
      };

      firstValueFrom(this.dataService.updateHardwareInputType(formData))
        .then(() => {
          this.snackBar.open('Hardware Input Type Updated Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'updated', data: formData });
        })
        .catch((error) => {
          console.error('Error updating hardware input type:', error);
          this.snackBar.open('Error has occurred when updating Hardware Input Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.editHardwareInputTypeForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
