import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, tap } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';
import { AddHardwareOutputTypeDialogComponent } from '../add-hardware-output-type-dialog/add-hardware-output-type-dialog.component';
import { EditHardwareOutputTypeDialogComponent } from '../edit-hardware-output-type-dialog/edit-hardware-output-type-dialog.component';

@Component({
    selector: 'opena3xx-manage-hardware-output-types',
    templateUrl: './manage-hardware-output-types.component.html',
    styleUrls: ['./manage-hardware-output-types.component.scss'],
    standalone: false
})
export class ManageHardwareOutputTypesComponent implements OnInit {
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
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: !this.dataLoaded,
      loadingMessage: 'Loading hardware output types...',
      emptyMessage: 'No hardware output types found',
      emptyIcon: 'logout_off',
      emptyAction: {
        label: 'Add First Hardware Output Type',
        action: () => this.addHardwareOutputType()
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
        label: 'Add Hardware Output Type',
        icon: 'add',
        color: 'primary',
        onClick: () => this.addHardwareOutputType()
      }
    ];
  }

  private loadData() {
    this.dataLoaded = false;
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.dataService
      .getAllHardwareOutputTypes()
      .pipe(
        tap((data) => console.log('Data received', data)),
        filter((x) => !!x),
        map((data_received) => {
          this.tableConfig = {
            ...this.tableConfig,
            data: data_received as HardwareOutputTypeDto[],
            loading: false
          };
          this.dataLoaded = true;
        })
      )
      .subscribe();
  }

  onEditClick(id: number) {
    const dialogRef = this.dialog.open(EditHardwareOutputTypeDialogComponent, {
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

  addHardwareOutputType() {
    const dialogRef = this.dialog.open(AddHardwareOutputTypeDialogComponent, {
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
