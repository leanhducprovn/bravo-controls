import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
