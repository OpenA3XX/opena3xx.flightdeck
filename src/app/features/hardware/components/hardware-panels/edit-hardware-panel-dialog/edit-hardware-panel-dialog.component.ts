import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { DataService } from 'src/app/core/services/data.service';
import { HardwarePanelOverviewDto, AddHardwarePanelDto, AircraftModelDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-edit-hardware-panel-dialog',
  templateUrl: './edit-hardware-panel-dialog.component.html',
  styleUrls: ['./edit-hardware-panel-dialog.component.scss'],
  standalone: false
})
export class EditHardwarePanelDialogComponent implements OnInit {
  editHardwarePanelForm: FormGroup;
  wrapperConfig: DialogWrapperConfig;
  hardwarePanel: HardwarePanelOverviewDto;
  loading = false;
  aircraftModels: AircraftModelDto[] = [];

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
    options: [],
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
        value: 'Co-Pilot',
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
    private dialogRef: MatDialogRef<EditHardwarePanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwarePanel: HardwarePanelOverviewDto },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.hardwarePanel = data.hardwarePanel;
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  ngOnInit(): void {
    this.loadAircraftModels();
    this.loadHardwarePanelDetails();
  }

  private initializeForm(): void {
    this.editHardwarePanelForm = this.formBuilder.group({
      hardwarePanelName: ['', { validators: [Validators.required], updateOn: 'change' }],
      aircraftModel: ['', { validators: [Validators.required], updateOn: 'change' }],
      cockpitArea: ['', { validators: [Validators.required], updateOn: 'change' }],
      hardwarePanelOwner: ['', { validators: [Validators.required], updateOn: 'change' }],
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Edit Hardware Panel',
      subtitle: `Edit "${this.hardwarePanel.name}"`,
      icon: 'edit',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

    private async loadAircraftModels(): Promise<void> {
    try {
      const aircraftModels = await firstValueFrom(this.dataService.getAllAircraftModels());

      // Update the aircraft model field config with loaded data
      this.aircraftModelFieldConfig.options = aircraftModels.map(model => ({
        key: model.id.toString(),
        value: model.name
      }));

      // Store aircraft models for later use in finding the correct ID
      this.aircraftModels = aircraftModels;
    } catch (error) {
      console.error('Error loading aircraft models:', error);
      this.snackBar.open('Error loading aircraft models', 'Ok', {
        duration: 3000,
      });
    }
  }

  private async loadHardwarePanelDetails(): Promise<void> {
    try {
      this.loading = true;
      const panelDetails = await firstValueFrom(this.dataService.getAllHardwarePanelDetails(this.hardwarePanel.id));

      // Populate form with existing data
      this.editHardwarePanelForm.patchValue({
        hardwarePanelName: this.hardwarePanel.name,
        aircraftModel: this.getAircraftModelId(this.hardwarePanel.aircraftModel),
        cockpitArea: this.getCockpitAreaKey(this.hardwarePanel.cockpitArea),
        hardwarePanelOwner: this.getOwnerKey(this.hardwarePanel.owner),
      });
    } catch (error) {
      console.error('Error loading hardware panel details:', error);
      this.snackBar.open('Error loading hardware panel details', 'Ok', {
        duration: 3000,
      });
    } finally {
      this.loading = false;
    }
  }

  private getAircraftModelId(aircraftModelName: string): string {
    const aircraftModel = this.aircraftModels.find(model => model.name === aircraftModelName);
    return aircraftModel ? aircraftModel.id.toString() : '';
  }

  private getCockpitAreaKey(area: string): string {
    const areaMap: { [key: string]: string } = {
      'Glareshield': '0',
      'Pedestal': '1',
      'Overhead': '2'
    };
    return areaMap[area] || '0';
  }

  private getOwnerKey(owner: string): string {
    const ownerMap: { [key: string]: string } = {
      'Pilot': '0',
      'Co-Pilot': '1',
      'Shared': '2'
    };
    return ownerMap[owner] || '0';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.editHardwarePanelForm.valid) {
      try {
        this.loading = true;
        const formData = this.editHardwarePanelForm.value;

        const updateData: AddHardwarePanelDto = {
          name: formData.hardwarePanelName,
          aircraftModel: parseInt(formData.aircraftModel),
          cockpitArea: parseInt(formData.cockpitArea),
          owner: parseInt(formData.hardwarePanelOwner)
        };

        await firstValueFrom(this.dataService.updateHardwarePanel(this.hardwarePanel.id, updateData));

        this.snackBar.open('Hardware Panel Updated Successfully', 'Ok', {
          duration: 3000,
        });

        this.dialogRef.close({ action: 'updated', data: this.hardwarePanel });
      } catch (error) {
        console.error('Error updating hardware panel:', error);
        this.snackBar.open('Error occurred while updating Hardware Panel', 'Ok', {
          duration: 3000,
        });
      } finally {
        this.loading = false;
      }
    } else {
      this.validateAllFormFields(this.editHardwarePanelForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }
}
