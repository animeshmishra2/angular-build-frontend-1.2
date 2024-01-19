import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './guards/guard.guard';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Role } from './shared/_model/user';


const routes: Routes = [
  {
    path: 'ggb-admin',
    canActivate: [GuardGuard],
    data: {
      roles: [Role.admin]
    },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'pos',
    canActivate: [GuardGuard],
    data: {
      roles: [Role.storeStaff],
      is_pos: 1
    },
    loadChildren: () => import('./pos/pos.module').then(m => m.PosModule)
  },
  {
    path: 'warehouse',
    canActivate: [GuardGuard],
    data: {
      roles: [Role.storeStaff],
      is_pos: 0
    },
    loadChildren: () => import('./waredepot/waredepot.module').then(m => m.WaredepotModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
