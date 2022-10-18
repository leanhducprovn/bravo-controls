export function copyOptions(options) {
    var key,
        copy = {};
    for (key in options) {
        if (options.hasOwnProperty(key)) {
            copy[key] = options[key];
        }
    }
    return copy;
}

export function ensureFlagExists(item, options, defalut: boolean = false) {
    if (!(item in options) || typeof options[item] !== 'boolean') {
        options[item] = defalut;
    }
}

export function ensureSpacesExists(options) {
    if (
        !('spaces' in options) ||
        (typeof options.spaces !== 'number' && typeof options.spaces !== 'string')
    ) {
        options.spaces = 0;
    }
}

export function ensureKeyExists(key, options) {
    if (!(key + 'Key' in options) || typeof options[key + 'Key'] !== 'string') {
        options[key + 'Key'] = options.compact ? '_' + key : key;
    }
}

export function checkFnExists(key, options) {
    return key + 'Fn' in options;
}
