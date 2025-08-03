import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';
import { FieldConfig } from 'src/app/shared/models/field.interface';

@Component({
  selector: 'opena3xx-edit-hardware-board-dialog',
  templateUrl: './edit-hardware-board-dialog.component.html',
  styleUrls: ['./edit-hardware-board-dialog.component.scss'],
  standalone: false
})
export class EditHardwareBoardDialogComponent implements OnInit {
  wrapperConfig: DialogWrapperConfig;
  form: FormGroup;
  loading = false;
  totalDiscreteInputOutput: number;

  boardNameFieldConfig: FieldConfig = {
    hint: 'Enter the name of the Hardware Board',
    inputType: 'text',
    label: 'Name',
    name: 'name',
    type: 'input',
    validations: [
      {
        message: 'Hardware Board Name is Required',
        name: 'required',
        validator: Validators.required,
      },
    ],
  };

  totalExtendersFieldConfig: FieldConfig = {
    hint: 'Select Total Extenders (MCP23017)',
    label: 'Total I²C Extenders on board',
    maxValue: '8',
    minValue: '1',
    name: 'hardwareBusExtendersCount',
    stepValue: '1',
    type: 'slider',
    value: 1,
  };

  constructor(
    private dialogRef: MatDialogRef<EditHardwareBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareBoard: HardwareBoardDto },
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.initializeWrapperConfig();
    this.initializeForm();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Edit Hardware Board',
      subtitle: `Update hardware board "${this.data.hardwareBoard.name}"`,
      icon: 'edit',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      hardwareBusExtendersCount: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private populateForm(): void {
    const hardwareBoard = this.data.hardwareBoard;
    this.form.patchValue({
      name: hardwareBoard.name,
      hardwareBusExtendersCount: hardwareBoard.hardwareBusExtendersCount
    });

    // Calculate total I/O based on the current value
    this.totalDiscreteInputOutput = hardwareBoard.hardwareBusExtendersCount * 16;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      this.loading = true;
      try {
        const formData = this.form.value;
        const updatedHardwareBoard: HardwareBoardDto = {
          id: this.data.hardwareBoard.id,
          name: formData.name,
          hardwareBusExtendersCount: formData.hardwareBusExtendersCount,
          totalInputOutputs: this.totalDiscreteInputOutput
        };

        await firstValueFrom(this.dataService.updateHardwareBoard(this.data.hardwareBoard.id, updatedHardwareBoard));

        this.snackBar.open('Hardware Board Updated Successfully', 'Ok', {
          duration: 3000,
        });

        this.dialogRef.close({ action: 'updated', data: updatedHardwareBoard });
      } catch (error) {
        console.error('Error updating hardware board:', error);
        this.snackBar.open('Error occurred while updating Hardware Board', 'Ok', {
          duration: 3000,
        });
      } finally {
        this.loading = false;
      }
    }
  }

  onSliderValueChange(value: number): void {
    this.totalDiscreteInputOutput = value * 16;
  }
}
