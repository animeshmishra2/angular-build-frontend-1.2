import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';

import { NgxSpinnerModule } from 'ngx-spinner';

// PrimeNg Shared Modules
const PRIME_NG_SHARED_MODULES = [
  CalendarModule,
  TableModule,
  MultiSelectModule,
  DropdownModule,
  MenubarModule,
  ButtonModule,
  MenuModule,
  DialogModule,
  ChartModule,
  SelectButtonModule
]

const OTHER_SHARED_MODULES = [
  NgxSpinnerModule
]

const SHARED_MODULES = [
  ...PRIME_NG_SHARED_MODULES,
  ...OTHER_SHARED_MODULES,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SHARED_MODULES
  ],
  exports: SHARED_MODULES,
})
export class SharedGlobalModule { }
