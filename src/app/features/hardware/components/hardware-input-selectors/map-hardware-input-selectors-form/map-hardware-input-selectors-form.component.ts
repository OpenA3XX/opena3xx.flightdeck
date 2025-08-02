import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  HardwareBoardDetailsDto,
  MapExtenderBitToHardwareInputSelectorDto,
} from 'src/app/shared/models/models';
import { FieldConfig, OptionList } from 'src/app/shared/models/field.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { firstValueFrom } from 'rxjs';
@Component({
    selector: 'opena3xx-map-hardware-input-selectors-form',
    templateUrl: './map-hardware-input-selectors-form.component.html',
    styleUrls: ['./map-hardware-input-selectors-form.component.scss'],
    standalone: false
})
export class MapHardwareInputSelectorsFormComponent implements OnInit {
  public hardwareBoardId: number;
  private hardwareBoardDetails: HardwareBoardDetailsDto | null = null;

  @Input() hardwareInputSelectorId!: number;

  mapHardwareInputSelectorsForm: FormGroup;



  public hardwareBoardsFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board Selection',
    name: 'hardwareBoards',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board is Required',
      },
    ],
  };

  public ioExtenderFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board IO Extender Bus Selection',
    name: 'hardwareBusExtenders',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board IO Extender Bus that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board IO Extender is Required',
      },
    ],
  };

  public ioExtenderBitFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board IO Extender Bit Selection',
    name: 'hardwareBusExtenderBits',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board IO Extender Bit that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board IO Extender Bit is Required',
      },
    ],
  };

  public eventDetails: string;

  constructor(
    formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.mapHardwareInputSelectorsForm = formBuilder.group({
      hardwareBoards: [null, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenders: [null, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenderBits: [null, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  async ngOnInit(): Promise<void> {
    if (!this.hardwareInputSelectorId) {
      console.error('hardwareInputSelectorId is not set!');
      return;
    }

    try {
      const data = await firstValueFrom(
        this.dataService.getHardwareBoardAssociationForHardwareInputSelector(this.hardwareInputSelectorId)
      ) as MapExtenderBitToHardwareInputSelectorDto;

      await this.fetchHardwareBoards();

      if (
        data.hardwareBoardId != 0 &&
        data.hardwareExtenderBusBitId != 0 &&
        data.hardwareExtenderBusId != 0
      ) {
        await this.loadIoExtenderData(data.hardwareBoardId);
        await this.loadIoExtenderBitsData(data.hardwareExtenderBusId);

        this.mapHardwareInputSelectorsForm.controls['hardwareBoards'].setValue(
          data.hardwareBoardId.toString()
        );
        this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenders'].setValue(
          data.hardwareExtenderBusId.toString()
        );
        this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenderBits'].setValue(
          data.hardwareExtenderBusBitId.toString()
        );
      }
    } catch (error: any) {
      console.error('Error initializing component:', error);
      this._snackBar.open('Error loading data', 'Close', { duration: 3000 });
    }
  }

  async fetchHardwareBoards(): Promise<void> {
    try {
      const hardwareBoardList = await firstValueFrom(this.dataService.getAllHardwareBoards()) as HardwareBoardDto[];

      this.hardwareBoardsFieldConfig.options = [];
      _.forEach(hardwareBoardList, (item) => {
        const optionList: OptionList = {
          key: item.id.toString(),
          value: item.name,
        };
        this.hardwareBoardsFieldConfig.options.push(optionList);
      });
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Error fetching hardware boards:', error);
      this._snackBar.open('Error loading hardware boards', 'Close', { duration: 3000 });
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  async onSubmit(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }
    if (this.mapHardwareInputSelectorsForm.valid) {
      try {
        const linkExtenderBitToHardwareInputSelector: MapExtenderBitToHardwareInputSelectorDto = {
          hardwareBoardId: this.mapHardwareInputSelectorsForm.value.hardwareBoards,
          hardwareExtenderBusBitId: this.mapHardwareInputSelectorsForm.value.hardwareBusExtenderBits,
          hardwareExtenderBusId: this.mapHardwareInputSelectorsForm.value.hardwareBusExtenders,
          hardwareInputSelectorId: this.hardwareInputSelectorId,
        };

        await firstValueFrom(this.dataService.mapExtenderBitToHardwareInputSelector(linkExtenderBitToHardwareInputSelector));

        this._snackBar.open('Linking Saved Successfully', 'Ok', {
          duration: 3000,
        });

        console.log(this.hardwareInputSelectorId, this.mapHardwareInputSelectorsForm.value);
      } catch (error: any) {
        console.error('Error saving mapping:', error);
        this._snackBar.open('Error saving mapping', 'Close', { duration: 3000 });
      }
    } else {
      this.validateAllFormFields(this.mapHardwareInputSelectorsForm);
    }
  }

  async onHardwareBoardSelectChange(selectChangeEvent: any): Promise<void> {
    try {
      await this.loadIoExtenderData(selectChangeEvent.value);
    } catch (error: any) {
      console.error('Error loading IO extender data:', error);
      this._snackBar.open('Error loading IO extender data', 'Close', { duration: 3000 });
    }
  }

  async onIoExtenderSelectChange(selectChangeEvent: any): Promise<void> {
    try {
      await this.loadIoExtenderBitsData(selectChangeEvent.value);
    } catch (error: any) {
      console.error('Error loading IO extender bits data:', error);
      this._snackBar.open('Error loading IO extender bits data', 'Close', { duration: 3000 });
    }
  }

  async onIoExtenderBitSelectChange(): Promise<void> {
    try {
      // Add any additional logic needed when the bit is selected
      // For example, you might want to validate the selection or update other form fields
    } catch (error: any) {
      console.error('Error handling IO extender bit selection:', error);
      this._snackBar.open('Error handling bit selection', 'Close', { duration: 3000 });
    }
  }



    async loadIoExtenderData(hardwareBoardId: number): Promise<void> {
    try {
      this.hardwareBoardId = hardwareBoardId;
      this.ioExtenderFieldConfig.options = [];

      this.hardwareBoardDetails = await firstValueFrom(
        this.dataService.getHardwareBoardDetails(hardwareBoardId)
      ) as HardwareBoardDetailsDto;

      console.log('Hardware Board Details:', this.hardwareBoardDetails);
      console.log('IO Extender Buses:', this.hardwareBoardDetails.ioExtenderBuses);

      _.each(this.hardwareBoardDetails.ioExtenderBuses, (ioExtender) => {
        const optionList: OptionList = {
          key: ioExtender.id.toString(),
          value: ioExtender.name.replace('Bus', 'Bus '),
        };
        this.ioExtenderFieldConfig.options.push(optionList);
      });

      console.log('IO Extender Options:', this.ioExtenderFieldConfig.options);
      this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenders'].reset();
    } catch (error: any) {
      console.error('Error loading IO extender data:', error);
      this._snackBar.open('Error loading IO extender data', 'Close', { duration: 3000 });
    }
  }

    async loadIoExtenderBitsData(extenderId: number): Promise<void> {
    try {
      console.log('loadIoExtenderBitsData called with extenderId:', extenderId);
      console.log('Current hardwareBoardId:', this.hardwareBoardId);
      console.log('Stored hardware board details:', this.hardwareBoardDetails);

      this.ioExtenderBitFieldConfig.options = [];

      if (!this.hardwareBoardDetails) {
        console.error('No hardware board details available');
        this._snackBar.open('No hardware board data available', 'Close', { duration: 3000 });
        return;
      }

      let foundExtender = false;
      _.each(this.hardwareBoardDetails.ioExtenderBuses, (ioExtender) => {
        console.log('Checking extender:', ioExtender.id, 'against:', extenderId);
        if (ioExtender.id == extenderId) {
          foundExtender = true;
          console.log('Found matching extender:', ioExtender);
          console.log('IO Extender Bus Bits:', ioExtender.ioExtenderBusBits);

          console.log('Processing IO Extender Bus Bits:', ioExtender.ioExtenderBusBits);
          _.each(ioExtender.ioExtenderBusBits, (ioExtenderBit) => {
            console.log('Processing bit:', ioExtenderBit);
            let optionListValue: string = `${ioExtenderBit.name} `;

            if (
              ioExtenderBit.hardwareInputSelectorFullName === null &&
              ioExtenderBit.hardwareOutputSelectorFullName === null
            ) {
              console.log('Not Mapped');
              optionListValue += ' - Not Mapped';
            } else if (
              ioExtenderBit.hardwareInputSelectorFullName !== null &&
              ioExtenderBit.hardwareOutputSelectorFullName === null
            ) {
              console.log('Mapped already to Input');
              optionListValue +=
                ' - Currently Mapped to ' +
                ioExtenderBit.hardwareInputSelectorFullName +
                ' (Input from Board)';
            } else if (
              ioExtenderBit.hardwareInputSelectorFullName === null &&
              ioExtenderBit.hardwareOutputSelectorFullName !== null
            ) {
              console.log('Mapped already to Output');
              optionListValue +=
                ' - Currently Mapped to ' +
                ioExtenderBit.hardwareOutputSelectorFullName +
                ' (Output to Board)';
            }
            optionListValue = optionListValue.replace('Bit', 'Bit ');

            const optionList: OptionList = {
              key: ioExtenderBit.id.toString(),
              value: optionListValue,
            };
            console.log('Adding option:', optionList);
            this.ioExtenderBitFieldConfig.options.push(optionList);
          });

          this.ioExtenderBitFieldConfig.options = _.orderBy(
            this.ioExtenderBitFieldConfig.options,
            ['value'],
            ['asc']
          );
        }
      });

      if (!foundExtender) {
        console.warn('No matching extender found for ID:', extenderId);
        console.log('Available extenders:', this.hardwareBoardDetails.ioExtenderBuses.map(e => ({ id: e.id, name: e.name })));
      }

            console.log('Final IO Extender Bit Options:', this.ioExtenderBitFieldConfig.options);
      console.log('Field config options length:', this.ioExtenderBitFieldConfig.options.length);

      // Test if options are properly set
      setTimeout(() => {
        console.log('Options after timeout:', this.ioExtenderBitFieldConfig.options);
        console.log('Field config object:', this.ioExtenderBitFieldConfig);
      }, 100);

      this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenderBits'].reset();

      // Force change detection to update the dropdown
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Error loading IO extender bits data:', error);
      this._snackBar.open('Error loading IO extender bits data', 'Close', { duration: 3000 });
    }
  }
}
