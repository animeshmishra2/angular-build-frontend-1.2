import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageBranchCategoryComponent } from './package-branch-category.component';
import { PackageBranchComponent } from './package-branch/package-branch.component';
import { PackageCategoryComponent } from './package-category/package-category.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  { path: '', component: PackageBranchCategoryComponent },
  { path: 'category', component: PackageCategoryComponent },
  { path: 'branch', component: PackageBranchComponent },
]

@NgModule({
  declarations: [
    PackageBranchCategoryComponent,
    PackageBranchComponent,
    PackageCategoryComponent,
  ],
  imports: [
    MatCardModule,
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PackageBranchCategoryModule { }
