import { Component, Input, OnInit } from '@angular/core';
import {
  HardwareBoardDetailsDto,
  MapExtenderBitToHardwareOutputSelectorDto,
} from 'src/app/shared/models/models';
import { FieldConfig, OptionList } from 'src/app/shared/models/field.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareBoardDto } from 'src/app/shared/models/models';
@Component({
    selector: 'opena3xx-map-hardware-output-selectors-form',
    templateUrl: './map-hardware-output-selectors-form.component.html',
    styleUrls: ['./map-hardware-output-selectors-form.component.scss'],
    standalone: false
})
export class MapHardwareOutputSelectorsFormComponent implements OnInit {
  public hardwareBoardId: number;

  @Input() hardwareOutputSelectorId!: number;

  mapHardwareOutputSelectorsForm: FormGroup;



  public hardwareBoardsFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board Selection',
    name: 'hardwareBoards',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board that is responsible for such Hardware Output',
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
    hint: 'Select Hardware Board IO Extender Bus that is responsible for such Hardware Output',
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
    hint: 'Select Hardware Board IO Extender Bit that is responsible for such Hardware Output',
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
    private _snackBar: MatSnackBar
  ) {
    this.mapHardwareOutputSelectorsForm = formBuilder.group({
      hardwareBoards: [null, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenders: [null, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenderBits: [null, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  ngOnInit(): void {
    this.dataService
      .getHardwareBoardAssociationForHardwareOutputSelector(this.hardwareOutputSelectorId)
      .toPromise()
      .then((data: MapExtenderBitToHardwareOutputSelectorDto) => {
        this.fetchHardwareBoards().finally(() => {
          if (
            data.hardwareBoardId != 0 &&
            data.hardwareExtenderBusBitId != 0 &&
            data.hardwareExtenderBusId != 0
          ) {
            this.loadIoExtenderData(data.hardwareBoardId).finally(() => {
              this.loadIoExtenderBitsData(data.hardwareExtenderBusId).finally(() => {
                console.log(this.mapHardwareOutputSelectorsForm.controls['hardwareBoards']);
                this.mapHardwareOutputSelectorsForm.controls['hardwareBoards'].setValue(
                  data.hardwareBoardId.toString()
                );
                this.mapHardwareOutputSelectorsForm.controls['hardwareBusExtenders'].setValue(
                  data.hardwareExtenderBusId.toString()
                );
                this.mapHardwareOutputSelectorsForm.controls['hardwareBusExtenderBits'].setValue(
                  data.hardwareExtenderBusBitId.toString()
                );
              });
            });
          }
        });
      });
  }

  fetchHardwareBoards() {
    return this.dataService
      .getAllHardwareBoards()
      .toPromise()
      .then((hardwareBoardList: HardwareBoardDto[]) => {
        this.hardwareBoardsFieldConfig.options = [];
        _.forEach(hardwareBoardList, (item) => {
          const optionList: OptionList = {
            key: item.id.toString(),
            value: item.name,
          };
          this.hardwareBoardsFieldConfig.options.push(optionList);
        });
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.mapHardwareOutputSelectorsForm.valid) {
      const linkExtenderBitToHardwareOutputSelector: MapExtenderBitToHardwareOutputSelectorDto = {
        hardwareBoardId: this.mapHardwareOutputSelectorsForm.value.hardwareBoards,
        hardwareExtenderBusBitId: this.mapHardwareOutputSelectorsForm.value.hardwareBusExtenderBits,
        hardwareExtenderBusId: this.mapHardwareOutputSelectorsForm.value.hardwareBusExtenders,
        hardwareOutputSelectorId: this.hardwareOutputSelectorId,
      };

      this.dataService
        .mapExtenderBitToHardwareOutputSelector(linkExtenderBitToHardwareOutputSelector)
        .toPromise()
        .then(() => {
          this._snackBar.open('Linking Saved Successfully', 'Ok', {
            duration: 3000,
          });
        });
      console.log(this.hardwareOutputSelectorId, this.mapHardwareOutputSelectorsForm.value);
    } else {
      this.validateAllFormFields(this.mapHardwareOutputSelectorsForm);
    }
  }

  onHardwareBoardSelectChange(selectChangeEvent: any) {
    this.loadIoExtenderData(selectChangeEvent.value);
  }

  onIoExtenderSelectChange(selectChangeEvent: any) {
    this.loadIoExtenderBitsData(selectChangeEvent.value);
  }

  loadIoExtenderData(hardwareBoardId: number) {
    this.hardwareBoardId = hardwareBoardId;
    this.ioExtenderFieldConfig.options = [];
    return this.dataService
      .getHardwareBoardDetails(hardwareBoardId)
      .toPromise()
      .then((hardwareBoardDetailsDto: HardwareBoardDetailsDto) => {
        console.log(hardwareBoardDetailsDto);
        _.each(hardwareBoardDetailsDto.ioExtenderBuses, (ioExtender) => {
          const optionList: OptionList = {
            key: ioExtender.id.toString(),
            value: ioExtender.name.replace('Bus', 'Bus '),
          };
          this.ioExtenderFieldConfig.options.push(optionList);
        });
        this.mapHardwareOutputSelectorsForm.controls['hardwareBusExtenders'].reset();
      });
  }

  loadIoExtenderBitsData(extenderId: number) {
    console.log('loadIoExtenderBitsData', extenderId);
    this.ioExtenderBitFieldConfig.options = [];
    return this.dataService
      .getHardwareBoardDetails(this.hardwareBoardId)
      .toPromise()
      .then((hardwareBoardDetailsDto: HardwareBoardDetailsDto) => {
        _.each(hardwareBoardDetailsDto.ioExtenderBuses, (ioExtender) => {
          if (ioExtender.id === extenderId) {
            _.each(ioExtender.ioExtenderBusBits, (ioExtenderBit) => {
              let optionListValue: string = `${ioExtenderBit.name} `;

              if (
                            ioExtenderBit.hardwareInputSelectorFullName === null &&
            ioExtenderBit.hardwareOutputSelectorFullName === null
              ) {
                optionListValue += ' - Not Mapped';
              } else if (
                                  ioExtenderBit.hardwareInputSelectorFullName !== null &&
                ioExtenderBit.hardwareOutputSelectorFullName === null
              ) {
                optionListValue +=
                  ' - Currently Mapped to ' +
                  ioExtenderBit.hardwareInputSelectorFullName +
                  ' (Input from Board)';
              } else if (
                ioExtenderBit.hardwareInputSelectorFullName === null &&
                                  ioExtenderBit.hardwareOutputSelectorFullName !== null
              ) {
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
              this.ioExtenderBitFieldConfig.options.push(optionList);
            });
            this.ioExtenderBitFieldConfig.options = _.orderBy(
              this.ioExtenderBitFieldConfig.options,
              ['value'],
              ['asc']
            );
          }
        });
        this.mapHardwareOutputSelectorsForm.controls['hardwareBusExtenderBits'].reset();
      });
  }
}
