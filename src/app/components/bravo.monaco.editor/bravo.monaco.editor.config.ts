import { InjectionToken } from '@angular/core';

export const BRAVO_MONACO_EDITOR_CONFIG = new InjectionToken('BRAVO_MONACO_EDITOR_CONFIG');

export interface BravoMonacoEditorConfig {
	baseUrl?: string;
	defaultOptions?: { [key: string]: any; };
	onMonacoLoad?: Function;
}
