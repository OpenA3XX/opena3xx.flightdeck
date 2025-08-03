import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { AddHardwareOutputDto, HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-add-hardware-output-dialog',
  templateUrl: './add-hardware-output-dialog.component.html',
  styleUrls: ['./add-hardware-output-dialog.component.scss'],
  standalone: false
})
export class AddHardwareOutputDialogComponent {
  addOutputForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwareOutputTypes: HardwareOutputTypeDto[] = [];
  loading = false;
  panelId: number;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareOutputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { panelId: number },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.panelId = data.panelId;
    this.initializeForm();
    this.initializeWrapperConfig();
    this.loadHardwareOutputTypes();
  }

  private initializeForm(): void {
    this.addOutputForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      hardwareOutputTypeId: ['', [Validators.required]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Output',
      subtitle: 'Add a new hardware output to this panel',
      icon: 'add_circle',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private async loadHardwareOutputTypes(): Promise<void> {
    try {
      this.loading = true;
      const types = await firstValueFrom(this.dataService.getAllHardwareOutputTypes());
      this.hardwareOutputTypes = types as HardwareOutputTypeDto[];
    } catch (error) {
      console.error('Error loading hardware output types:', error);
      this.snackBar.open('Error loading hardware output types', 'Ok', {
        duration: 3000,
      });
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addOutputForm.valid) {
      this.loading = true;
      const formData: AddHardwareOutputDto = {
        name: this.addOutputForm.value.name,
        hardwareOutputType: this.addOutputForm.value.hardwareOutputTypeId,
        hardwarePanelId: this.panelId
      };

      firstValueFrom(this.dataService.addHardwareOutput(formData))
        .then(() => {
          this.snackBar.open('Hardware Output Added Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware output:', error);
          this.snackBar.open('Error occurred while adding Hardware Output', 'Ok', {
            duration: 3000,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.validateAllFormFields(this.addOutputForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
