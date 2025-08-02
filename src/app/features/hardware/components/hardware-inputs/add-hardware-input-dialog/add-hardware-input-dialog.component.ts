import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { AddHardwareInputDto, HardwareInputTypeDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-add-hardware-input-dialog',
    templateUrl: './add-hardware-input-dialog.component.html',
    styleUrls: ['./add-hardware-input-dialog.component.scss'],
    standalone: false
})
export class AddHardwareInputDialogComponent implements OnInit {
  addHardwareInputForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwareInputTypes: HardwareInputTypeDto[] = [];
  loading = false;
  panelId: number;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { panelId: number },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.panelId = data.panelId;
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  ngOnInit(): void {
    this.loadHardwareInputTypes();
  }

  private initializeForm(): void {
    this.addHardwareInputForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      hardwareInputType: ['', [Validators.required]]
      // Note: hardwarePanelId is not in the form - it's handled internally
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Input',
      subtitle: 'Create a new hardware input for this panel',
      icon: 'input',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private async loadHardwareInputTypes(): Promise<void> {
    try {
      this.loading = true;
      const types = await firstValueFrom(this.dataService.getAllHardwareInputTypes());
      this.hardwareInputTypes = types as HardwareInputTypeDto[];
    } catch (error) {
      console.error('Error loading hardware input types:', error);
      this.snackBar.open('Error loading hardware input types', 'Close', {
        duration: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addHardwareInputForm.valid) {
      const formData: AddHardwareInputDto = {
        name: this.addHardwareInputForm.value.name,
        hardwareInputType: this.addHardwareInputForm.value.hardwareInputType,
        hardwarePanelId: this.panelId, // Use the passed panel ID
        hardwareInputSelectors: []
      };

      firstValueFrom(this.dataService.addHardwareInput(formData))
        .then(() => {
          this.snackBar.open('Hardware Input Added Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware input:', error);
          this.snackBar.open('Error occurred while adding Hardware Input', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwareInputForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
