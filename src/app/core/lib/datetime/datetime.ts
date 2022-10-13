import * as wjc from '@grapecity/wijmo';

// @dynamic
export class DateTime extends wjc.DateTime {
    public static get now(): Date {
        let _d = new Date();
        return _d;
    }

    public static get utcNow(): Date {
        let _d = new Date();
        return _d.toUniversalTime();
    }

    public static lastMonth(date?: Date): Date {
        let _d = date ? date : new Date(),
            _thisMonth = _d.getMonth();
        let _lastMonth = _d.addMonths(-1);

        if (_lastMonth.getMonth() == _thisMonth) {
            return _d.addDays(-_d.getDate());
        }

        return _lastMonth;
    }

    public static nextMonth(date: Date): Date {
        let _d = date ? date : new Date(),
            _thisMonth = _d.getMonth();
        let _nextMonth = _d.addMonths(1);

        if (_nextMonth.getMonth() == _thisMonth + 2) {
            return _nextMonth.addDays(-_nextMonth.getDate());
        }

        return _nextMonth;
    }

    public static lastYear(date: Date): Date {
        let _d = date ? date : new Date(),
            _thisMonth = _d.getMonth();
        let _lastYear = this.addYears(_d, -1);

        if (_lastYear.getMonth() != _thisMonth) {
            return _lastYear.addDays(-_lastYear.getDate());
        }

        return _lastYear;
    }

    public static nextYear(date: Date): Date {
        let _d = date ? date : new Date(),
            _thisMonth = _d.getMonth();
        let nextYear = this.addYears(_d, 1);

        if (nextYear.getMonth() !== _thisMonth) {
            return nextYear.addDays(-nextYear.getDate());
        }

        return nextYear;
    }
}
