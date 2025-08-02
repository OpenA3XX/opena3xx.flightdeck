import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-edit-hardware-output-type-dialog',
    templateUrl: './edit-hardware-output-type-dialog.component.html',
    styleUrls: ['./edit-hardware-output-type-dialog.component.scss'],
    standalone: false
})
export class EditHardwareOutputTypeDialogComponent implements OnInit {
  editHardwareOutputTypeForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwareOutputType: HardwareOutputTypeDto | null = null;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<EditHardwareOutputTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  ngOnInit(): void {
    this.loadHardwareOutputType();
  }

  private initializeForm(): void {
    this.editHardwareOutputTypeForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Edit Hardware Output Type',
      subtitle: 'Update hardware output type configuration',
      icon: 'edit',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  private loadHardwareOutputType(): void {
    this.loading = true;
    firstValueFrom(this.dataService.getHardwareOutputTypeById(this.data.id))
      .then((data) => {
        this.hardwareOutputType = data as HardwareOutputTypeDto;
        this.editHardwareOutputTypeForm.patchValue({
          id: this.hardwareOutputType.id,
          name: this.hardwareOutputType.name
        });
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error loading hardware output type:', error);
        this.snackBar.open('Error loading hardware output type', 'Close', {
          duration: 3000
        });
        this.loading = false;
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editHardwareOutputTypeForm.valid) {
      const formData: HardwareOutputTypeDto = {
        id: this.editHardwareOutputTypeForm.value.id,
        name: this.editHardwareOutputTypeForm.value.name
      };

      firstValueFrom(this.dataService.updateHardwareOutputType(formData))
        .then(() => {
          this.snackBar.open('Hardware Output Type Updated Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'updated', data: formData });
        })
        .catch((error) => {
          console.error('Error updating hardware output type:', error);
          this.snackBar.open('Error has occurred when updating Hardware Output Type', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.editHardwareOutputTypeForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
