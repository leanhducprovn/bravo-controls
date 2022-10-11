import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoPictureInputBox } from './components/bravo.picture.input.box/bravo.picture.input.box';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';
import { BravoTest } from './components/bravo.test/bravo.test';
import { BravoTabGrid } from './components/bravo.tab.grid/bravo.tab.grid';
import { BravoEditor } from './components/bravo.editor/bravo.editor';

const routes: Routes = [
	{
		path: 'bravo-editor',
		component: BravoEditor,
	},
	{
		path: 'bravo-tab-grid',
		component: BravoTabGrid,
	},
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
		component: BravoPictureInputBox
	},
	{
		path: 'bravo-test',
		component: BravoTest
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
