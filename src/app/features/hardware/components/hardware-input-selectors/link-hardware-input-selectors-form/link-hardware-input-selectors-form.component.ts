import { Component, Input, OnInit } from '@angular/core';
import { FieldConfig, OptionList } from 'src/app/shared/models/field.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulatorEventItemDto } from 'src/app/shared/models/models';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'opena3xx-link-hardware-input-selectors-form',
    templateUrl: './link-hardware-input-selectors-form.component.html',
    styleUrls: ['./link-hardware-input-selectors-form.component.scss'],
    standalone: false
})
export class LinkHardwareInputSelectorsFormComponent implements OnInit {
  @Input() hardwareInputSelectorId!: number;

  linkHardwareInputSelectorsForm: FormGroup;



  public simulatorEventTestInProgress: boolean = false;

  public simulatorEventsFieldConfig: FieldConfig = {
    type: 'autocomplete',
    label: 'Simulator Event',
    name: 'simulatorEvents',
    inputType: 'text',
    options: [],
    hint: 'Select event to trigger to the Simulator Software',
    // validations: [
    //   {
    //     name: 'required',
    //     validator: Validators.required,
    //     message: 'Simulator Event is Required',
    //   },
    // ],
  };

  public integrationTypeFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Integration Type',
    name: 'integrationTypes',
    inputType: 'text',
    options: [],
    hint: 'Select type of integration to the Simulator Software',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Integration Type is Required',
      },
    ],
  };

  public eventDetails: string;

  public autocompleteValue: string;

  constructor(
    formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.linkHardwareInputSelectorsForm = formBuilder.group({
      integrationTypes: [{ validators: [Validators.required], updateOn: 'change' }],
      simulatorEvents: [{ validators: [Validators.required], updateOn: 'change' }],
    });
  }

  async ngOnInit() {
    if (!this.hardwareInputSelectorId) {
      console.error('hardwareInputSelectorId is not set!');
      return;
    }
    await this.fetchData();
  }

  readAutoCompleteValue(value) {
    this.autocompleteValue = value;
  }
  async fetchData() {
    try {
      const integrationTypes = await firstValueFrom(this.dataService.getAllIntegrationTypes()) as OptionList[];
      this.integrationTypeFieldConfig.options = integrationTypes;

      const hardwareInputSelectorDetails = await firstValueFrom(
        this.dataService.getHardwareInputSelectorDetails(this.hardwareInputSelectorId)
      ) as any;

      if (hardwareInputSelectorDetails.simulatorEventDto != undefined) {
        this.linkHardwareInputSelectorsForm.controls['integrationTypes'].setValue(
          hardwareInputSelectorDetails.simulatorEventDto.simulatorEventSdkType
        );

        const simulatorEvents = await firstValueFrom(
          this.dataService.getAllSimulatorEventsByIntegrationType(
            hardwareInputSelectorDetails.simulatorEventDto.simulatorEventSdkType
          )
        ) as SimulatorEventItemDto[];

        _.each(simulatorEvents, (entry) => {
          this.simulatorEventsFieldConfig.options.push({
            key: entry.id.toString(),
            value: `${entry.eventName} => ${entry.eventCode}`,
          });
        });
        this.linkHardwareInputSelectorsForm.controls['simulatorEvents'].setValue(
          hardwareInputSelectorDetails.simulatorEventDto.eventCode
        );
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      this._snackBar.open('Error loading data', 'Close', { duration: 3000 });
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  onSimulatorEventTest() {
    this.simulatorEventTestInProgress = true;
  }

  onSave() {
    this.simulatorEventTestInProgress = false;
  }

  async onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    try {
      if (this.simulatorEventTestInProgress) {
        await firstValueFrom(
          this.dataService.sendSimulatorTestEvent(this.linkHardwareInputSelectorsForm.value.simulatorEvents)
        );
        this._snackBar.open('Simulator Test Event Sent Successfully', 'Ok', {
          duration: 1000,
        });
      } else {
        await firstValueFrom(
          this.dataService.linkSimulatorEventToHardwareInputSelector(
            this.hardwareInputSelectorId,
            this.autocompleteValue
          )
        );
        this._snackBar.open('Linking Saved Successfully', 'Ok', {
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      this._snackBar.open('Error saving data', 'Close', { duration: 3000 });
    }
  }

  async onIntegrationTypeChange() {
    try {
      this.simulatorEventsFieldConfig.options = [];
      const data = await firstValueFrom(
        this.dataService.getAllSimulatorEventsByIntegrationType(this.linkHardwareInputSelectorsForm.value.integrationTypes)
      ) as SimulatorEventItemDto[];

      _.each(data, (entry) => {
        this.simulatorEventsFieldConfig.options.push({
          key: entry.id.toString(),
          value: `${entry.eventName} => ${entry.eventCode}`,
        });
      });
    } catch (error: any) {
      console.error('Error loading simulator events:', error);
      this._snackBar.open('Error loading simulator events', 'Close', { duration: 3000 });
    }
    this.linkHardwareInputSelectorsForm.controls['simulatorEvents'].reset();
  }
}
