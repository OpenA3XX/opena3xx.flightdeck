import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputDto, AddHardwareOutputSelectorDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-add-hardware-output-selector-dialog',
  templateUrl: './add-hardware-output-selector-dialog.component.html',
  styleUrls: ['./add-hardware-output-selector-dialog.component.scss'],
  standalone: false
})
export class AddHardwareOutputSelectorDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  form: FormGroup;
  hardwareOutput: HardwareOutputDto;

  constructor(
    private dialogRef: MatDialogRef<AddHardwareOutputSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwareOutput: HardwareOutputDto },
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.hardwareOutput = data.hardwareOutput;
    this.initializeForm();
    this.initializeWrapperConfig();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Hardware Output Selector',
      subtitle: `Add a new selector to "${this.hardwareOutput.name}"`,
      icon: 'add',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      try {
        const selectorData: AddHardwareOutputSelectorDto = {
          name: this.form.get('name')?.value
        };

        await firstValueFrom(this.dataService.addHardwareOutputSelector(this.hardwareOutput.id, selectorData));

        this.snackBar.open('Hardware Output Selector Added Successfully', 'Ok', {
          duration: 3000,
        });

        this.dialogRef.close({ action: 'added', data: selectorData });
      } catch (error) {
        console.error('Error adding hardware output selector:', error);
        this.snackBar.open('Error occurred while adding Hardware Output Selector', 'Ok', {
          duration: 3000,
        });
      }
    }
  }
}
