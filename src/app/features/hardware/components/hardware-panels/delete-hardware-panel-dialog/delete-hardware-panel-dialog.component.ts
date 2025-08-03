import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { HardwarePanelOverviewDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-delete-hardware-panel-dialog',
  templateUrl: './delete-hardware-panel-dialog.component.html',
  styleUrls: ['./delete-hardware-panel-dialog.component.scss'],
  standalone: false
})
export class DeleteHardwarePanelDialogComponent {
  wrapperConfig: DialogWrapperConfig;
  hardwarePanel: HardwarePanelOverviewDto;

  constructor(
    private dialogRef: MatDialogRef<DeleteHardwarePanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hardwarePanel: HardwarePanelOverviewDto },
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    this.hardwarePanel = data.hardwarePanel;
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Hardware Panel',
      subtitle: `Are you sure you want to delete "${this.hardwarePanel.name}"?`,
      icon: 'delete_forever',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.hardwarePanel && this.hardwarePanel.id) {
      firstValueFrom(this.dataService.deleteHardwarePanel(this.hardwarePanel.id))
        .then(() => {
          this.snackBar.open('Hardware Panel Deleted Successfully', 'Ok', {
            duration: 3000,
          });
          this.dialogRef.close({ action: 'deleted', data: this.hardwarePanel });
        })
        .catch((error) => {
          console.error('Error deleting hardware panel:', error);
          this.snackBar.open('Error occurred while deleting Hardware Panel', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.snackBar.open('Invalid hardware panel data', 'Ok', {
        duration: 3000,
      });
    }
  }
}
