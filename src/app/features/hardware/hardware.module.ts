import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

// Hardware Services
import { HardwarePanelService } from './services/hardware-panel.service';
import { HardwareBoardService } from './services/hardware-board.service';
import { HardwareInputService } from './services/hardware-input.service';
import { HardwareOutputService } from './services/hardware-output.service';

// Hardware Components

import { ManageHardwareBoardsComponent } from './components/hardware-boards/manage-hardware-boards/manage-hardware-board.component';
import { ManageHardwareInputTypesComponent } from './components/hardware-input-types/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './components/hardware-output-types/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './components/hardware-panels/manage-hardware-panels/manage-hardware-panels.component';

import { ViewHardwarePanelDetailsComponent } from './components/hardware-panels/view-hardware-panel-details/view-hardware-panel-details.component';

// Hardware Dialog Components
import { LinkHardwareInputSelectorsDialogComponent } from './components/hardware-input-selectors/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from './components/hardware-input-selectors/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from './components/hardware-output-selectors/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareInputSelectorsDialogComponent } from './components/hardware-input-selectors/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from './components/hardware-output-selectors/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { DeleteHardwareInputDialogComponent } from './components/hardware-inputs/delete-hardware-input-dialog/delete-hardware-input-dialog.component';
import { AddHardwarePanelDialogComponent } from './components/hardware-panels/add-hardware-panel-dialog/add-hardware-panel-dialog.component';
import { DeleteHardwarePanelDialogComponent } from './components/hardware-panels/delete-hardware-panel-dialog/delete-hardware-panel-dialog.component';
import { EditHardwarePanelDialogComponent } from './components/hardware-panels/edit-hardware-panel-dialog/edit-hardware-panel-dialog.component';
import { EditHardwareBoardDialogComponent } from './components/hardware-boards/edit-hardware-board-dialog/edit-hardware-board-dialog.component';
import { DeleteHardwareBoardDialogComponent } from './components/hardware-boards/delete-hardware-board-dialog/delete-hardware-board-dialog.component';
import { DeleteHardwareInputTypeDialogComponent } from './components/hardware-input-types/delete-hardware-input-type-dialog/delete-hardware-input-type-dialog.component';
import { DeleteHardwareOutputTypeDialogComponent } from './components/hardware-output-types/delete-hardware-output-type-dialog/delete-hardware-output-type-dialog.component';
import { AddHardwareInputTypeDialogComponent } from './components/hardware-input-types/add-hardware-input-type-dialog/add-hardware-input-type-dialog.component';
import { AddHardwareOutputTypeDialogComponent } from './components/hardware-output-types/add-hardware-output-type-dialog/add-hardware-output-type-dialog.component';
import { RegisterHardwareBoardDialogComponent } from './components/hardware-boards/register-hardware-board-dialog/register-hardware-board-dialog.component';
import { EditHardwareInputTypeDialogComponent } from './components/hardware-input-types/edit-hardware-input-type-dialog/edit-hardware-input-type-dialog.component';
import { EditHardwareOutputTypeDialogComponent } from './components/hardware-output-types/edit-hardware-output-type-dialog/edit-hardware-output-type-dialog.component';
import { AddHardwareInputDialogComponent } from './components/hardware-inputs/add-hardware-input-dialog/add-hardware-input-dialog.component';
import { ManageHardwareInputsComponent } from './components/hardware-inputs/manage-hardware-inputs/manage-hardware-inputs.component';
import { AddHardwareInputSelectorDialogComponent } from './components/hardware-input-selectors/add-hardware-input-selector-dialog/add-hardware-input-selector-dialog.component';
import { DeleteHardwareInputSelectorDialogComponent } from './components/hardware-input-selectors/delete-hardware-input-selector-dialog/delete-hardware-input-selector-dialog.component';
import { ManageHardwareOutputsComponent } from './components/hardware-outputs/manage-hardware-outputs/manage-hardware-outputs.component';
import { AddHardwareOutputSelectorDialogComponent } from './components/hardware-output-selectors/add-hardware-output-selector-dialog/add-hardware-output-selector-dialog.component';
import { DeleteHardwareOutputSelectorDialogComponent } from './components/hardware-output-selectors/delete-hardware-output-selector-dialog/delete-hardware-output-selector-dialog.component';
import { DeleteHardwareOutputDialogComponent } from './components/hardware-outputs/delete-hardware-output-dialog/delete-hardware-output-dialog.component';
import { AddHardwareOutputDialogComponent } from './components/hardware-outputs/add-hardware-output-dialog/add-hardware-output-dialog.component';

// Hardware Form Components
import { LinkHardwareInputSelectorsFormComponent } from './components/hardware-input-selectors/link-hardware-input-selectors-form/link-hardware-input-selectors-form.component';
import { MapHardwareInputSelectorsFormComponent } from './components/hardware-input-selectors/map-hardware-input-selectors-form/map-hardware-input-selectors-form.component';
import { MapHardwareOutputSelectorsFormComponent } from './components/hardware-output-selectors/map-hardware-output-selectors-form/map-hardware-output-selectors-form.component';

// Core Services
import { DataService } from 'src/app/core/services/data.service';

@NgModule({
  declarations: [
    ManageHardwareBoardsComponent,
    ManageHardwareInputTypesComponent,
    ManageHardwareOutputTypesComponent,
    ManageHardwarePanelsComponent,
    ViewHardwarePanelDetailsComponent,

    // Hardware Dialog Components
    LinkHardwareInputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    DeleteHardwareInputDialogComponent,
    AddHardwarePanelDialogComponent,
    AddHardwareInputTypeDialogComponent,
    AddHardwareOutputTypeDialogComponent,
    RegisterHardwareBoardDialogComponent,
    EditHardwareInputTypeDialogComponent,
    EditHardwareOutputTypeDialogComponent,

    // Hardware Form Components
    LinkHardwareInputSelectorsFormComponent,
    MapHardwareInputSelectorsFormComponent,
    MapHardwareOutputSelectorsFormComponent,
    AddHardwareInputDialogComponent,
    ManageHardwareInputsComponent,
    AddHardwareInputSelectorDialogComponent,
    DeleteHardwareInputSelectorDialogComponent,
    DeleteHardwarePanelDialogComponent,
    EditHardwareBoardDialogComponent,
    DeleteHardwareBoardDialogComponent,
    DeleteHardwareInputTypeDialogComponent,
    DeleteHardwareOutputTypeDialogComponent,
    ManageHardwareOutputsComponent,
    AddHardwareOutputSelectorDialogComponent,
    DeleteHardwareOutputSelectorDialogComponent,
    DeleteHardwareOutputDialogComponent,
    AddHardwareOutputDialogComponent,
    EditHardwarePanelDialogComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    MatDialogModule
  ],
  exports: [
    ManageHardwareBoardsComponent,
    ManageHardwareInputTypesComponent,
    ManageHardwareOutputTypesComponent,
    ManageHardwarePanelsComponent,
    ViewHardwarePanelDetailsComponent,

    // Hardware Dialog Components
    LinkHardwareInputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    DeleteHardwareInputDialogComponent,
    AddHardwarePanelDialogComponent,
    AddHardwareInputTypeDialogComponent,
    AddHardwareOutputTypeDialogComponent,
    RegisterHardwareBoardDialogComponent,
    EditHardwareInputTypeDialogComponent,
    EditHardwareOutputTypeDialogComponent,

    // Hardware Form Components
    LinkHardwareInputSelectorsFormComponent,
    MapHardwareInputSelectorsFormComponent,
    MapHardwareOutputSelectorsFormComponent,
    AddHardwareInputDialogComponent,
    ManageHardwareInputsComponent,
    AddHardwareInputSelectorDialogComponent,
    DeleteHardwareInputSelectorDialogComponent,
    DeleteHardwarePanelDialogComponent,
    EditHardwareBoardDialogComponent,
    DeleteHardwareBoardDialogComponent,
    DeleteHardwareInputTypeDialogComponent,
    DeleteHardwareOutputTypeDialogComponent,
    ManageHardwareOutputsComponent,
    AddHardwareOutputSelectorDialogComponent,
    DeleteHardwareOutputSelectorDialogComponent,
    DeleteHardwareOutputDialogComponent,
    AddHardwareOutputDialogComponent,
    EditHardwarePanelDialogComponent,

  ],
  providers: [
    HardwarePanelService,
    HardwareBoardService,
    HardwareInputService,
    HardwareOutputService,
    DataService
  ]
})
export class HardwareModule { }
