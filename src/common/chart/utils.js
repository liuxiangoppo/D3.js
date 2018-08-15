/**
 * 判断是否为对象
 * @param {*} value
 * @return {boolean}
 */
export function isObject$1(value) {
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}


const objToString = Object.prototype.toString;

/**
 * 判断是否数组
 * @param {*} value 
 */
export function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

/**
 * 判断是否dom节点
 * @param {*} value
 * @return {boolean}
 */
export function isDom(value) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}

// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // For node-canvas
    '[object Image]': 1,
    '[object Canvas]': 1
};

var TYPED_ARRAY = {
    '[object Int8Array]': 1,
    '[object Uint8Array]': 1,
    '[object Uint8ClampedArray]': 1,
    '[object Int16Array]': 1,
    '[object Uint16Array]': 1,
    '[object Int32Array]': 1,
    '[object Uint32Array]': 1,
    '[object Float32Array]': 1,
    '[object Float64Array]': 1
};

/**
 * @memberOf module:zrender/core/util
 * @param {*} value
 * @return {boolean}
 */
export function isBuiltInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

var primitiveKey = '__ec_primitive__';

export function isPrimitive(obj) {
    return obj[primitiveKey];
}

/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 *
 * @param {*} source
 * @return {*} new
 */
export function clone(source) {
    if (source == null || typeof source != 'object') {
        return source;
    }

    var result = source;
    var typeStr = objToString.call(source);

    if (typeStr === '[object Array]') {
        if (!isPrimitive(source)) {
            result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        }
    }
    else if (TYPED_ARRAY[typeStr]) {
        if (!isPrimitive(source)) {
            var Ctor = source.constructor;
            if (source.constructor.from) {
                result = Ctor.from(source);
            }
            else {
                result = new Ctor(source.length);
                for (var i = 0, len = source.length; i < len; i++) {
                    result[i] = clone(source[i]);
                }
            }
        }
    }
    else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }

    return result;
}

/**
 * 深度合并
 * @memberOf module:zrender/core/util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
export function merge(target, source, overwrite) {
    // We should escapse that source is string
    // and enter for ... in ...
    if (!isObject$1(source) || !isObject$1(target)) {
        return overwrite ? clone(source) : target;
    }

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetProp = target[key];
            var sourceProp = source[key];

            if (isObject$1(sourceProp)
                && isObject$1(targetProp)
                && !isArray(sourceProp)
                && !isArray(targetProp)
                && !isDom(sourceProp)
                && !isDom(targetProp)
                && !isBuiltInObject(sourceProp)
                && !isBuiltInObject(targetProp)
                && !isPrimitive(sourceProp)
                && !isPrimitive(targetProp)
            ) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            }
            else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = clone(source[key], true);
            }
        }
    }

    return target;
}

/**
 * 设置属性
 * @param {*} element 
 * @param {*} attrObj 
 */
export function setAttr(element, attrObj) {
    Object.keys(attrObj).forEach((key, i) => {
        element.attr(key, attrObj[key]);
    });
    return element;
}

/**
 * 设置样式
 * @param {*} element 
 * @param {*} styleObj 
 */
export function setStyle(element, styleObj) {
    Object.keys(styleObj).forEach((key, i) => {
        var attr = key.replace(/[A-Z]/g, function (word) {
            return '-' + word.toLowerCase();
        });
        element.style(attr, styleObj[key]);
    });
    return element;
}

/**
 * 将像素字符串转换成数值 
 * 例如: 25px => 25
 * @param {*} pixelStr 
 */
export function getInterPixel(pixelStr) {
    if (typeof pixelStr === 'string') {
        return parseInt(pixelStr.substring(pixelStr.length - 2, pixelStr));
    }
}

/**
 * 根据字符大小获取传递字符串的长度
 * @param {*} str 字符串
 * @param {*} fontsize 字符大小
 */
export function getPixelLength(str, fontsize) {
    var curLen = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var pixelLen = code > 255 ? fontsize : fontsize / 2;
        curLen += pixelLen;
    }
    return curLen;
};

/**
 * 格式化数值 以千为单位加上逗号分隔
 * @param {*} num 
 */
export function toThousands(num) {
    var result = [], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}

/**
     * 在两个值之间随机获取数值
     * @param {*} Min 最小值
     * @param {*} Max 最大值
     */
export function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
}