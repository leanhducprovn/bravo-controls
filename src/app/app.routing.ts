import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoPictureInputBoxComponent } from './components/bravo.picture.input.box/bravo.picture.input.box';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';

const routes: Routes = [
  {
    path: 'bravo-toolbar',
    component: BravoToolbar,
  },
  {
    path: 'bravo-picture-editor',
    component: BravoPictureEditor,
  },
  {
    path: 'bravo-dialog-data-button',
    component: BravoDialogDataButton
  },
  {
    path: 'bravo-tab-grid-layout',
    component: BravoTabGridLayout
  },
  {
    path: 'bravo-picture-input-box',
    component: BravoPictureInputBoxComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
