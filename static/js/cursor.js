/**
 * Created by cuixiaohui on 2017/11/20.
 */
//获取光标位置
function getCursortPosition(obj) {
    var cursorIndex = 0;
    console.log('a');
    if (document.selection) {
        // IE Support
        console.log('b');
        obj.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -obj.value.length);
        cursorIndex = range.text.length;
    } else if (obj.selectionStart || obj.selectionStart==0) {
        // another support
        console.log('c');
        cursorIndex = obj.selectionStart;
    }
    return cursorIndex;
}
// 设置光标位置
function setCaretPosition(textDom, pos){
    if(textDom.setSelectionRange) {
        // IE Support
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
    }else if (textDom.createTextRange) {
        // Firefox support
        var range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
// 获取选中文字
function getSelectText() {
    var userSelection, text;
    if (window.getSelection) {
        // Firefox support
        userSelection = window.getSelection();
    } else if (document.selection) {
        // IE Support
        userSelection = document.selection.createRange();
    }
    if (!(text = userSelection.text)) {
        text = userSelection;
    }
    return text;
}
/**
 * 选中特定范围的文本
 * 参数：
 *     textDom  [JavaScript DOM String] 当前对象
 *     startPos  [Int]  起始位置
 *     endPos  [Int]  终点位置
 */
function setSelectText(textDom, startPos, endPos) {
    var startPos = parseInt(startPos),
        endPos = parseInt(endPos),
        textLength = textDom.value.length;
    if(textLength){
        if(!startPos){
            startPos = 0;
        }
        if(!endPos){
            endPos = textLength;
        }
        if(startPos > textLength){
            startPos = textLength;
        }
        if(endPos > textLength){
            endPos = textLength;
        }
        if(startPos < 0){
            startPos = textLength + startPos;
        }
        if(endPos < 0){
            endPos = textLength + endPos;
        }
        if(textDom.createTextRange){
            // IE Support
            var range = textDom.createTextRange();
            range.moveStart("character",-textLength);
            range.moveEnd("character",-textLength);
            range.moveStart("character", startPos);
            range.moveEnd("character",endPos);
            range.select();
        }else{
            // Firefox support
            textDom.setSelectionRange(startPos, endPos);
            textDom.focus();
        }
    }
}

/**
 * 在光标后插入文本
 * 参数：
 *     textDom  [JavaScript DOM String] 当前对象
 *     value  [String]  要插入的文本
 */
function insertAfterText(textDom, value) {
    var selectRange;
    if (document.selection) {
        // IE Support
        textDom.focus();
        selectRange = document.selection.createRange();
        selectRange.text = value;
        textDom.focus();
    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
        // Firefox support
        var startPos = textDom.selectionStart;
        var endPos = textDom.selectionEnd;
        var scrollTop = textDom.scrollTop;
        textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
        textDom.focus();
        textDom.selectionStart = startPos + value.length;
        textDom.selectionEnd = startPos + value.length;
        textDom.scrollTop = scrollTop;
    }
    else {
        textDom.value += value;
        textDom.focus();
    }
}

/**
 * 文本框根据输入内容自适应高度
 * @param                {HTMLElement}        输入框元素
 * @param                {Number}                设置光标与输入框保持的距离(默认0)
 * @param                {Number}                设置最大高度(可选)
 */
var autoTextarea = function (elem, extra, maxHeight) {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function (type, callback) {
            elem.addEventListener ?
                elem.addEventListener(type, callback, false) :
                elem.attachEvent('on' + type, callback);
        },
        getStyle = elem.currentStyle ? function (name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
                var rect = elem.getBoundingClientRect();
                return rect.bottom - rect.top -
                    parseFloat(getStyle('paddingTop')) -
                    parseFloat(getStyle('paddingBottom')) + 'px';
            }

            return val;
        } : function (name) {
            return getComputedStyle(elem, null)[name];
        },
        minHeight = parseFloat(getStyle('height'));

    elem.style.resize = 'none';

    var change = function () {
        var scrollTop, height,
            padding = 0,
            style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;

        if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        }
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
                height = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                height = elem.scrollHeight - padding;
                style.overflowY = 'hidden';
            }
            style.height = height + extra + 'px';
            scrollTop += parseInt(style.height) - elem.currHeight;
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            elem.currHeight = parseInt(style.height);
        }
    };

    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();
};