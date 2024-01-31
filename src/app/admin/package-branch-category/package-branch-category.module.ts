import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DirectiveModule } from 'src/app/directives/directive/directive.module';
import { ButtonModule } from 'primeng/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BaseModule } from 'src/app/base/base.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PackageBranchCategoryComponent } from './package-branch-category.component';
import { AddEditPackageBrandCategoryComponent } from './add-edit-package-brand-category/add-edit-package-brand-category.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditUpdateBrandCategryComponent } from './edit-update-brand-categry/edit-update-brand-categry.component';


const routes: Routes = [
  { path: '', component: PackageBranchCategoryComponent },
]

@NgModule({
  declarations: [
    PackageBranchCategoryComponent,
    AddEditPackageBrandCategoryComponent,
    EditUpdateBrandCategryComponent,
  ],
  imports: [
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    DirectiveModule,
    BaseModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSnackBarModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTooltipModule,
    MatCheckboxModule,
    ButtonModule,
    MatCardModule,
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PackageBranchCategoryModule { }
