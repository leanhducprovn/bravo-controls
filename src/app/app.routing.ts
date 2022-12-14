import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoPictureInputBox } from './components/bravo.picture.input.box/bravo.picture.input.box';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';

import { BravoMonacoEditorDemo } from './demo/bravo.monaco.editor.demo/bravo.monaco.editor.demo';
import { BravoPictureEditorDemo } from './demo/bravo.picture.editor.demo/bravo.picture.editor.demo';
import { BravoMonacoEditorBaseDemo } from './demo/bravo.monaco.editor.base.demo/bravo.monaco.editor.base.demo';
import { BravoDocxtemplater } from './components/bravo.docxtemplater/bravo.docxtemplater';
import { BravoWebviewer } from './components/bravo.webviewer/bravo.webviewer';
import { BravoDocxPreview } from './components/bravo.docx.preview/bravo.docx.preview';
import { BravoTabGridLayoutDemo } from './demo/bravo.tab.grid.layout.demo/bravo.tab.grid.layout.demo';
import { BravoFullScreen } from './layouts/bravo.full.screen/bravo.full.screen';
import { BravoTools } from './layouts/bravo.tools/bravo.tools';
import { BravoDemo } from './layouts/bravo.demo/bravo.demo';
import { BravoHome } from './layouts/bravo.home/bravo.home';
import { BravoCalendar } from './components/bravo.calendar/bravo.calendar';
import { BravoCalendarDemo } from './demo/bravo.calendar.demo/bravo.calendar.demo';
import { BravoIframe } from './components/bravo.iframe/bravo.iframe';
import { BravoLogin } from './components/bravo.login/bravo.login';

const routes: Routes = [
	/**
	 * Home
	 */
	{
		path: '',
		component: BravoHome
	},

	/**
	 * Full
	 */
	{
		path: 'full',
		component: BravoFullScreen,
		children: [
			{
				path: 'bravo-login',
				component: BravoLogin
			},
			{
				path: 'bravo-iframe',
				component: BravoIframe
			},
			{
				path: 'bravo-calendar',
				component: BravoCalendar
			},
			{
				path: 'bravo-docx-preview',
				component: BravoDocxPreview
			},
			{
				path: 'bravo-monaco-editor',
				component: BravoMonacoEditorDemo
			},
			{
				path: 'bravo-docxtemplater',
				component: BravoDocxtemplater
			},
			{
				path: 'bravo-toolbar',
				component: BravoToolbar
			},
			{
				path: 'bravo-picture-editor',
				component: BravoPictureEditor
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
				path: 'bravo-webviewer',
				component: BravoWebviewer
			}
		]
	},

	/**
	 * Tools
	 */
	{
		path: 'tools',
		component: BravoTools,
		children: [
			{
				path: 'bravo-iframe',
				component: BravoIframe
			},
			{
				path: 'bravo-calendar',
				component: BravoCalendar
			},
			{
				path: 'bravo-docx-preview',
				component: BravoDocxPreview
			},
			{
				path: 'bravo-monaco-editor',
				component: BravoMonacoEditorDemo
			},
			{
				path: 'bravo-docxtemplater',
				component: BravoDocxtemplater
			},
			{
				path: 'bravo-toolbar',
				component: BravoToolbar
			},
			{
				path: 'bravo-picture-editor',
				component: BravoPictureEditor
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
				path: 'bravo-webviewer',
				component: BravoWebviewer
			}
		]
	},

	/**
	 * Demo
	 */
	{
		path: 'demo',
		component: BravoDemo,
		children: [
			{
				path: 'bravo-calendar',
				component: BravoCalendarDemo
			},
			{
				path: 'bravo-tab-grid-layout',
				component: BravoTabGridLayoutDemo
			},
			{
				path: 'bravo-monaco-editor-base',
				component: BravoMonacoEditorBaseDemo
			},
			{
				path: 'bravo-monaco-editor',
				component: BravoMonacoEditorDemo
			},
			{
				path: 'bravo-picture-editor',
				component: BravoPictureEditorDemo
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
