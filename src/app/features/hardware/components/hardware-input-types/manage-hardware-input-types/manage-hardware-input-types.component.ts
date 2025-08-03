import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, tap } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { AddHardwareInputTypeDialogComponent } from '../add-hardware-input-type-dialog/add-hardware-input-type-dialog.component';
import { EditHardwareInputTypeDialogComponent } from '../edit-hardware-input-type-dialog/edit-hardware-input-type-dialog.component';
import { DeleteHardwareInputTypeDialogComponent } from '../delete-hardware-input-type-dialog/delete-hardware-input-type-dialog.component';

@Component({
    selector: 'opena3xx-manage-hardware-input-types',
    templateUrl: './manage-hardware-input-types.component.html',
    styleUrls: ['./manage-hardware-input-types.component.scss'],
    standalone: false
})
export class ManageHardwareInputTypesComponent implements OnInit {
  tableConfig: DataTableConfig;
  dataLoaded = false;
  headerActions: PageHeaderAction[] = [];

  constructor(
    private dataService: DataService,
    public router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.initializeHeaderActions();
    this.loadData();
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
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '200px',
        type: 'actions',
        actions: [
          {
            label: 'Edit',
            icon: 'edit',
            color: 'primary',
            tooltip: 'Edit',
            action: (item) => this.onEditClick(item.id)
          },
          {
            label: 'Delete',
            icon: 'delete',
            color: 'warn',
            tooltip: 'Delete',
            action: (item) => this.onDeleteHardwareInputType(item)
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: !this.dataLoaded,
      loadingMessage: 'Loading hardware input types...',
      emptyMessage: 'No hardware input types found',
      emptyIcon: 'login_off',
      emptyAction: {
        label: 'Add First Hardware Input Type',
        action: () => this.addHardwareInputType()
      },
      searchPlaceholder: 'Search by name...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [5, 10, 25, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Add Hardware Input Type',
        icon: 'add',
        color: 'primary',
        onClick: () => this.addHardwareInputType()
      }
    ];
  }

  private loadData() {
    this.dataLoaded = false;
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.dataService
      .getAllHardwareInputTypes()
      .pipe(
        tap((data) => console.log('Data received', data)),
        filter((x) => !!x),
        map((data_received) => {
          this.tableConfig = {
            ...this.tableConfig,
            data: data_received as unknown as HardwareInputTypeDto[],
            loading: false
          };
          this.dataLoaded = true;
        })
      )
      .subscribe();
  }

  onEditClick(id: number) {
    const dialogRef = this.dialog.open(EditHardwareInputTypeDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'updated') {
        // Refresh the data after successful update
        this.loadData();
      }
    });
  }

  addHardwareInputType() {
    const dialogRef = this.dialog.open(AddHardwareInputTypeDialogComponent, {
      width: '500px',
      disableClose: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'added') {
        // Refresh the data after successful addition
        this.loadData();
      }
    });
  }

  onDeleteHardwareInputType(hardwareInputType: HardwareInputTypeDto) {
    const dialogRef = this.dialog.open(DeleteHardwareInputTypeDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { hardwareInputType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'deleted') {
        this.loadData();
      }
    });
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
}
