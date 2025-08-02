import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { DataService } from 'src/app/core/services/data.service';

@Component({
    selector: 'opena3xx-edit-hardware-panel',
    templateUrl: './edit-hardware-panel.component.html',
    styleUrls: ['./edit-hardware-panel.component.scss'],
    standalone: false
})
export class EditHardwarePanelComponent {
  addHardwarePanelForm: FormGroup;

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
    disabled: true,
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
        message: 'Aircraft Model is  Required',
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
        message: 'Cockpit Area is  Required',
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
        message: 'Hardware Panel Owner is is Required',
      },
    ],
  };

  constructor(
    private router: Router,
    formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.addHardwarePanelForm = formBuilder.group({
      hardwarePanelName: [null, { validators: [Validators.required], updateOn: 'change' }],
      aircraftModel: [null, { validators: [Validators.required], updateOn: 'change' }],
      cockpitArea: [null, { validators: [Validators.required], updateOn: 'change' }],
      hardwarePanelOwner: [null, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  back() {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  onSave() {}

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.addHardwarePanelForm.valid) {
      this.dataService
        .addHardwarePanel(this.addHardwarePanelForm.value)
        .toPromise()
        .then(() => {
          this.snackBar.open('Hardware Panel Added Successfully', 'Ok', {
            duration: 3000,
          });
        })
        .catch(() => {
          this.snackBar.open('Error has occured when adding Hardware Panel', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwarePanelForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }
}
