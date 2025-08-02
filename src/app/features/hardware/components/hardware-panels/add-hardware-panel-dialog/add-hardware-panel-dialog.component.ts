import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';
import { AircraftModelService } from 'src/app/features/aircraft-models/services/aircraft-model.service';
import { AircraftModelDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-add-hardware-panel-dialog',
    templateUrl: './add-hardware-panel-dialog.component.html',
    styleUrls: ['./add-hardware-panel-dialog.component.scss'],
    standalone: false
})
export class AddHardwarePanelDialogComponent implements OnInit {
  addHardwarePanelForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  aircraftModels: AircraftModelDto[] = [];
  loadingAircraftModels = false;

  // Field configs remain the same
  public hardwarePanelNameFieldConfig: FieldConfig = {
    type: 'input',
    label: 'Hardware Panel Name',
    name: 'hardwarePanelName',
    inputType: 'text',
    hint: 'Enter the Hardware Panel Name',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Panel Name is Required',
      },
    ],
  };

  public aircraftModelFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Aircraft Model',
    name: 'aircraftModel',
    inputType: 'text',
    options: [
      {
        key: '1',
        value: 'A320-NEO',
      },
    ],
    hint: 'Select Aircraft Model for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Aircraft Model is Required',
      },
    ],
  };

  public cockpitAreaFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Cockpit Area',
    name: 'cockpitArea',
    inputType: 'text',
    options: [
      {
        key: '0',
        value: 'Glareshield',
      },
      {
        key: '1',
        value: 'Pedestal',
      },
      {
        key: '2',
        value: 'Overhead',
      },
    ],
    hint: 'Select Cockpit Area for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Cockpit Area is Required',
      },
    ],
  };

  public hardwarePanelOwnerFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Panel Owner',
    name: 'hardwarePanelOwner',
    inputType: 'text',
    options: [
      {
        key: '0',
        value: 'Pilot',
      },
      {
        key: '1',
        value: 'CoPilot',
      },
      {
        key: '2',
        value: 'Shared',
      },
    ],
    hint: 'Select Hardware Panel Owner for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Panel Owner is Required',
      },
    ],
  };

  constructor(
    private dialogRef: MatDialogRef<AddHardwarePanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private aircraftModelService: AircraftModelService,
  ) {
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  private initializeForm(): void {
    this.addHardwarePanelForm = this.formBuilder.group({
      hardwarePanelName: ['', [Validators.required]],
      aircraftModel: ['', [Validators.required]],
      cockpitArea: ['', [Validators.required]],
      hardwarePanelOwner: ['', [Validators.required]],
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Panel',
      subtitle: 'Create a new hardware panel configuration',
      icon: 'add_box',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  ngOnInit(): void {
    this.loadAircraftModels();
  }

  private loadAircraftModels(): void {
    this.loadingAircraftModels = true;

    this.aircraftModelService.getAllAircraftModels().subscribe({
      next: (aircraftModels) => {
        this.aircraftModels = aircraftModels;
        this.updateAircraftModelFieldConfig();
        this.loadingAircraftModels = false;
      },
      error: (error) => {
        console.error('Error loading aircraft models:', error);
        this.loadingAircraftModels = false;
        this.snackBar.open('Error loading aircraft models', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private updateAircraftModelFieldConfig(): void {
    this.aircraftModelFieldConfig = {
      ...this.aircraftModelFieldConfig,
      options: this.aircraftModels.map(model => ({
        key: model.id.toString(),
        value: `${model.name} - ${model.manufacturer}`
      }))
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addHardwarePanelForm.valid) {
      // Convert form values to match backend expectations
      const formData = {
        ...this.addHardwarePanelForm.value,
        aircraftModel: parseInt(this.addHardwarePanelForm.value.aircraftModel, 10),
        cockpitArea: parseInt(this.addHardwarePanelForm.value.cockpitArea, 10),
        hardwarePanelOwner: parseInt(this.addHardwarePanelForm.value.hardwarePanelOwner, 10)
      };

      // Validate that all required numeric fields are valid numbers
      if (isNaN(formData.aircraftModel) || isNaN(formData.cockpitArea) || isNaN(formData.hardwarePanelOwner)) {
        this.snackBar.open('Please fill in all required fields with valid values', 'Ok', {
          duration: 3000,
        });
        return;
      }

      firstValueFrom(this.dataService.addHardwarePanel(formData))
        .then(() => {
          this.snackBar.open('Hardware Panel Added Successfully', 'Ok', {
            duration: 3000,
          });
          // Close dialog with success result
          this.dialogRef.close({ action: 'added', data: formData });
        })
        .catch((error) => {
          console.error('Error adding hardware panel:', error);
          this.snackBar.open('Error has occurred when adding Hardware Panel', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwarePanelForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
