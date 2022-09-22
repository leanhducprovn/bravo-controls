import { ExtensionsMethod } from './extensions.method';

export class BravoWatcher {
    private _zText: string;

    constructor(pzText?: string) {
        if (String.isNullOrEmpty(pzText))
            pzText = ExtensionsMethod.guid();

        this._zText = pzText;

        performance.clearMarks(pzText);
        performance.clearMeasures(this.measureName);
        performance.mark(pzText);
    }

    private get measureName(): string {
        return "Measure_" + this._zText
    }

    private _nElapsed: number = -1;

    public get nElapsed(): number {
        if (this._nElapsed < 0)
            this._nElapsed = this.measuareDuration();

        return this._nElapsed;
    }

    public close() {
        this._nElapsed = this.measuareDuration();
        performance.clearMarks(this._zText);
    }

    private measuareDuration(): number {
        try {
            performance.measure(this.measureName, this._zText);

            let _nDuration = 0;
            let _entries = performance.getEntriesByName(this.measureName);
            for (const entry of _entries) {
                _nDuration += entry.duration;
            }

            return _nDuration;
        }
        catch{
            return -1;
        }
    }
}