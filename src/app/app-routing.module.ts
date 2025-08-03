import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Hardware Components



import { ManageHardwareBoardsComponent } from './features/hardware/components/hardware-boards/manage-hardware-boards/manage-hardware-board.component';
import { ManageHardwareInputTypesComponent } from './features/hardware/components/hardware-input-types/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './features/hardware/components/hardware-output-types/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './features/hardware/components/hardware-panels/manage-hardware-panels/manage-hardware-panels.component';
import { ManageHardwareInputsComponent } from './features/hardware/components/hardware-inputs/manage-hardware-inputs/manage-hardware-inputs.component';
import { ManageHardwareOutputsComponent } from './features/hardware/components/hardware-outputs/manage-hardware-outputs/manage-hardware-outputs.component';

import { ViewHardwarePanelDetailsComponent } from './features/hardware/components/hardware-panels/view-hardware-panel-details/view-hardware-panel-details.component';


// Dashboard Components
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

// Settings Components
import { SettingsComponent } from './features/settings/components/settings/settings.component';

// Console Components
import { ConsoleComponent } from './features/console/components/console/console.component';

// Simulator Components
import { ManageSimulatorEventsComponent } from './features/simulator/components/manage-simulator-events/manage-simulator-events.component';

// Notifications Components
// import { NotificationCenterComponent } from './features/notifications/components/notification-center/notification-center.component';

// Aircraft Models Components
import { ManageAircraftModelsComponent } from './features/aircraft-models/components/manage-aircraft-models/manage-aircraft-models.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'manage/hardware-panels',
    component: ManageHardwarePanelsComponent,
  },


  {
    path: 'view/hardware-panel-details',
    component: ViewHardwarePanelDetailsComponent,
  },
  {
    path: 'manage/hardware-input-types',
    component: ManageHardwareInputTypesComponent,
  },


  {
    path: 'manage/hardware-output-types',
    component: ManageHardwareOutputTypesComponent,
  },

  {
    path: 'manage/hardware-inputs',
    component: ManageHardwareInputsComponent,
  },
  {
    path: 'manage/hardware-outputs',
    component: ManageHardwareOutputsComponent,
  },

  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'manage/simulator-events',
    component: ManageSimulatorEventsComponent,
  },
  {
    path: 'manage/hardware-boards',
    component: ManageHardwareBoardsComponent,
  },

  {
    path: 'console',
    component: ConsoleComponent,
  },
  {
    path: 'manage/aircraft-models',
    component: ManageAircraftModelsComponent,
  },

  {
    path: 'connectivity',
    loadChildren: () => import('./features/connectivity/connectivity.module').then(m => m.ConnectivityModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
