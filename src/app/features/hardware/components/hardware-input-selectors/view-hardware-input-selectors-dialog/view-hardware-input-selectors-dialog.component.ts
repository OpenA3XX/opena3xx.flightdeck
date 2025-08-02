import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HardwareInputDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-view-hardware-input-selectors-dialog',
    templateUrl: './view-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./view-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class ViewHardwareInputSelectorsDialogComponent {
  tableConfig: DataTableConfig;
  public hardwareInputSelector: any;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dialogRef: MatDialogRef<ViewHardwareInputSelectorsDialogComponent>
  ) {
    this.hardwareInputSelector = data;
    console.log('Dialog Component', data);
    this.initializeWrapperConfig();
    this.initializeTableConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Hardware Input Selectors',
      subtitle: 'View input selectors for this hardware input',
      icon: 'input',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.hardwareInputSelector) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Input Selectors - ${this.hardwareInputSelector.name}`
      };
    }
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '80px',
        type: 'number'
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '60%',
        type: 'text'
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: this.hardwareInputSelector.hardwareInputSelectors || [],
      loading: false,
      emptyMessage: 'No input selectors found',
      emptyIcon: 'login_off',
      searchEnabled: false,
      paginationEnabled: false,
      sortEnabled: true,
      rowHover: true,
      elevation: 0
    };

    this.updateWrapperConfig();
  }

  onTableEvent(event: DataTableEvent): void {
    console.log('Table event:', event);

    switch (event.type) {
      case 'action':
        console.log('Action clicked:', event.action?.label, 'for item:', event.data);
        break;
      case 'rowClick':
        console.log('Row clicked:', event.data);
        break;
      case 'search':
        console.log('Search performed:', event.data);
        break;
      case 'pageChange':
        console.log('Page changed:', event.data);
        break;
      case 'sortChange':
        console.log('Sort changed:', event.data);
        break;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
