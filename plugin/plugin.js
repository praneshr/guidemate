/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin.ts":
/*!***********************!*\
  !*** ./src/plugin.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");

figma.showUI(__html__);
figma.ui.resize(350, 370);
const checkSelection = () => {
    const { selection } = figma.currentPage;
    if (selection.length === 0) {
        throw new Error('Select one layer to use Guide Mate');
    }
    if (selection.length > 1) {
        throw new Error('Multi selection is not supported');
    }
};
const addGuide = (frame, guides) => {
    const guideString = ({ axis, offset }) => `${axis}_${offset}`;
    const existingGuidesLookupMap = frame.guides.map(guideString);
    const filteredGuides = guides.filter((guide) => !existingGuidesLookupMap.includes(guideString(guide)));
    frame.guides = frame.guides.concat(filteredGuides);
};
const findFrame = (node) => {
    if (node.type === 'FRAME') {
        return node;
    }
    return findFrame(node.parent);
};
const handleShortcuts = (shortcut) => {
    const { selection } = figma.currentPage;
    const currentSelection = selection[0];
    const frame = findFrame(currentSelection);
    const { width, height, x: selectionX, y: selectionY } = currentSelection;
    const isSelectedFrame = frame === currentSelection;
    const x = isSelectedFrame ? 0 : selectionX;
    const y = isSelectedFrame ? 0 : selectionY;
    let guide;
    switch (shortcut) {
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].LEFT:
            guide = { axis: 'X', offset: x };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].RIGHT:
            guide = { axis: 'X', offset: x + width };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].VERTICAL_CENTER:
            guide = { axis: 'X', offset: x + (width / 2) };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].TOP:
            guide = { axis: 'Y', offset: y };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].HORIZONTAL_CENTER:
            guide = { axis: 'Y', offset: y + (height / 2) };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].BOTTOM:
            guide = { axis: 'Y', offset: y + height };
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["ShortcutTypes"].CLEAR:
            frame.guides = [];
            return;
        default:
            console.warn(`Unhandled shortcut: ${shortcut}`);
    }
    addGuide(frame, [guide]);
};
const calculateGuideBlock = (count, size, start, gutter, axis) => {
    const guides = [];
    let nextStart = start + size;
    for (let i = 0; i < count; i++) {
        if (i === 1 || i === count) {
            continue;
        }
        guides.push({
            axis,
            offset: nextStart,
        });
        if (gutter) {
            guides.push({
                axis,
                offset: nextStart + gutter,
            });
            nextStart = nextStart + gutter + size;
            continue;
        }
        nextStart += size;
    }
    return guides;
};
const handleAddGuides = (formData) => {
    const { selection } = figma.currentPage;
    const currentSelection = selection[0];
    const frame = findFrame(currentSelection);
    const { width, height, x: selectionX, y: selectionY } = currentSelection;
    const isSelectedFrame = frame === currentSelection;
    const x = isSelectedFrame ? 0 : selectionX;
    const y = isSelectedFrame ? 0 : selectionY;
    const formDataObject = formData.reduce((acc, { id, value }) => (Object.assign({}, acc, { [id]: value })), {});
    const marginGuides = formData.map(({ id, value }) => {
        switch (id) {
            case _types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].TOP_MARGIN:
                return { axis: 'Y', offset: y + value };
            case _types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].BOTTOM_MARGIN:
                return { axis: 'Y', offset: y + (height - value) };
            case _types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].LEFT_MARGIN:
                return { axis: 'X', offset: x + value };
            case _types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].RIGHT_MARGIN:
                return { axis: 'X', offset: x + (width - value) };
            default:
                return undefined;
        }
    }).filter(Boolean);
    const rowGutter = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].HORIZONTAL_GUTTER];
    const columnGutter = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].VERTICAL_GUTTER];
    const leftMargin = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].LEFT_MARGIN];
    const rightMargin = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].RIGHT_MARGIN];
    const topMargin = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].TOP_MARGIN];
    const bottomMargin = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].BOTTOM_MARGIN];
    const columns = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].NO_OF_COLUMNS];
    const rows = formDataObject[_types__WEBPACK_IMPORTED_MODULE_0__["FormInputs"].NO_OF_ROWS];
    const columnWidth = Math.round((width - (leftMargin + rightMargin + ((columns - 1) * columnGutter))) / columns);
    const rowHeight = Math.round((height - (topMargin + bottomMargin + ((rows - 1) * rowGutter))) / rows);
    const columnGuides = calculateGuideBlock(columns, columnWidth, x + leftMargin, columnGutter, 'X');
    const rowGuides = calculateGuideBlock(rows, rowHeight, y + topMargin, rowGutter, 'Y');
    addGuide(frame, [...marginGuides, ...columnGuides, ...rowGuides]);
};
figma.ui.onmessage = (msg) => {
    checkSelection();
    switch (msg.type) {
        case _types__WEBPACK_IMPORTED_MODULE_0__["MessageTypes"].SHORTCUTS:
            handleShortcuts(msg.data);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["MessageTypes"].ADD_GUIDES:
            handleAddGuides(msg.data);
            break;
        default:
    }
};


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! exports provided: ShortcutTypes, MessageTypes, FormInputs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShortcutTypes", function() { return ShortcutTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageTypes", function() { return MessageTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormInputs", function() { return FormInputs; });
var ShortcutTypes;
(function (ShortcutTypes) {
    ShortcutTypes[ShortcutTypes["UNKNOWN"] = 0] = "UNKNOWN";
    ShortcutTypes[ShortcutTypes["LEFT"] = 1] = "LEFT";
    ShortcutTypes[ShortcutTypes["VERTICAL_CENTER"] = 2] = "VERTICAL_CENTER";
    ShortcutTypes[ShortcutTypes["RIGHT"] = 3] = "RIGHT";
    ShortcutTypes[ShortcutTypes["TOP"] = 4] = "TOP";
    ShortcutTypes[ShortcutTypes["HORIZONTAL_CENTER"] = 5] = "HORIZONTAL_CENTER";
    ShortcutTypes[ShortcutTypes["BOTTOM"] = 6] = "BOTTOM";
    ShortcutTypes[ShortcutTypes["CLEAR"] = 7] = "CLEAR";
})(ShortcutTypes || (ShortcutTypes = {}));
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["UNKNOWN"] = 0] = "UNKNOWN";
    MessageTypes[MessageTypes["SHORTCUTS"] = 1] = "SHORTCUTS";
    MessageTypes[MessageTypes["ADD_GUIDES"] = 2] = "ADD_GUIDES";
})(MessageTypes || (MessageTypes = {}));
var FormInputs;
(function (FormInputs) {
    FormInputs[FormInputs["UNKNOWN"] = 0] = "UNKNOWN";
    FormInputs[FormInputs["LEFT_MARGIN"] = 1] = "LEFT_MARGIN";
    FormInputs[FormInputs["RIGHT_MARGIN"] = 2] = "RIGHT_MARGIN";
    FormInputs[FormInputs["TOP_MARGIN"] = 3] = "TOP_MARGIN";
    FormInputs[FormInputs["BOTTOM_MARGIN"] = 4] = "BOTTOM_MARGIN";
    FormInputs[FormInputs["NO_OF_COLUMNS"] = 5] = "NO_OF_COLUMNS";
    FormInputs[FormInputs["NO_OF_ROWS"] = 6] = "NO_OF_ROWS";
    FormInputs[FormInputs["WIDTH"] = 7] = "WIDTH";
    FormInputs[FormInputs["HEIGHT"] = 8] = "HEIGHT";
    FormInputs[FormInputs["VERTICAL_GUTTER"] = 9] = "VERTICAL_GUTTER";
    FormInputs[FormInputs["HORIZONTAL_GUTTER"] = 10] = "HORIZONTAL_GUTTER";
})(FormInputs || (FormInputs = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQWtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBLFdBQVcsWUFBWTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGVBQWUsUUFBUSxLQUFLLEdBQUcsT0FBTztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxZQUFZO0FBQ3ZCO0FBQ0E7QUFDQSxXQUFXLDhDQUE4QztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxvREFBYTtBQUMxQixxQkFBcUI7QUFDckI7QUFDQSxhQUFhLG9EQUFhO0FBQzFCLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWEsb0RBQWE7QUFDMUIscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYSxvREFBYTtBQUMxQixxQkFBcUI7QUFDckI7QUFDQSxhQUFhLG9EQUFhO0FBQzFCLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWEsb0RBQWE7QUFDMUIscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYSxvREFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsWUFBWTtBQUN2QjtBQUNBO0FBQ0EsV0FBVyw4Q0FBOEM7QUFDekQ7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFlBQVksc0JBQXNCLFFBQVEsY0FBYyxNQUFNO0FBQ2hILHdDQUF3QyxZQUFZO0FBQ3BEO0FBQ0EsaUJBQWlCLGlEQUFVO0FBQzNCLHdCQUF3QjtBQUN4QixpQkFBaUIsaURBQVU7QUFDM0Isd0JBQXdCO0FBQ3hCLGlCQUFpQixpREFBVTtBQUMzQix3QkFBd0I7QUFDeEIsaUJBQWlCLGlEQUFVO0FBQzNCLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUNBQXFDLGlEQUFVO0FBQy9DLHdDQUF3QyxpREFBVTtBQUNsRCxzQ0FBc0MsaURBQVU7QUFDaEQsdUNBQXVDLGlEQUFVO0FBQ2pELHFDQUFxQyxpREFBVTtBQUMvQyx3Q0FBd0MsaURBQVU7QUFDbEQsbUNBQW1DLGlEQUFVO0FBQzdDLGdDQUFnQyxpREFBVTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1EQUFZO0FBQ3pCO0FBQ0E7QUFDQSxhQUFhLG1EQUFZO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNuSUE7QUFBQTtBQUFBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDO0FBQ2hDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9DQUFvQztBQUM5QjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsZ0NBQWdDIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4udHNcIik7XG4iLCJpbXBvcnQgeyBTaG9ydGN1dFR5cGVzLCBNZXNzYWdlVHlwZXMsIEZvcm1JbnB1dHMgfSBmcm9tICcuL3R5cGVzJztcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG5maWdtYS51aS5yZXNpemUoMzUwLCAzNzApO1xuY29uc3QgY2hlY2tTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb24gfSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2VsZWN0IG9uZSBsYXllciB0byB1c2UgR3VpZGUgTWF0ZScpO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aSBzZWxlY3Rpb24gaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbn07XG5jb25zdCBhZGRHdWlkZSA9IChmcmFtZSwgZ3VpZGVzKSA9PiB7XG4gICAgY29uc3QgZ3VpZGVTdHJpbmcgPSAoeyBheGlzLCBvZmZzZXQgfSkgPT4gYCR7YXhpc31fJHtvZmZzZXR9YDtcbiAgICBjb25zdCBleGlzdGluZ0d1aWRlc0xvb2t1cE1hcCA9IGZyYW1lLmd1aWRlcy5tYXAoZ3VpZGVTdHJpbmcpO1xuICAgIGNvbnN0IGZpbHRlcmVkR3VpZGVzID0gZ3VpZGVzLmZpbHRlcigoZ3VpZGUpID0+ICFleGlzdGluZ0d1aWRlc0xvb2t1cE1hcC5pbmNsdWRlcyhndWlkZVN0cmluZyhndWlkZSkpKTtcbiAgICBmcmFtZS5ndWlkZXMgPSBmcmFtZS5ndWlkZXMuY29uY2F0KGZpbHRlcmVkR3VpZGVzKTtcbn07XG5jb25zdCBmaW5kRnJhbWUgPSAobm9kZSkgPT4ge1xuICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmaW5kRnJhbWUobm9kZS5wYXJlbnQpO1xufTtcbmNvbnN0IGhhbmRsZVNob3J0Y3V0cyA9IChzaG9ydGN1dCkgPT4ge1xuICAgIGNvbnN0IHsgc2VsZWN0aW9uIH0gPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uWzBdO1xuICAgIGNvbnN0IGZyYW1lID0gZmluZEZyYW1lKGN1cnJlbnRTZWxlY3Rpb24pO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgeDogc2VsZWN0aW9uWCwgeTogc2VsZWN0aW9uWSB9ID0gY3VycmVudFNlbGVjdGlvbjtcbiAgICBjb25zdCBpc1NlbGVjdGVkRnJhbWUgPSBmcmFtZSA9PT0gY3VycmVudFNlbGVjdGlvbjtcbiAgICBjb25zdCB4ID0gaXNTZWxlY3RlZEZyYW1lID8gMCA6IHNlbGVjdGlvblg7XG4gICAgY29uc3QgeSA9IGlzU2VsZWN0ZWRGcmFtZSA/IDAgOiBzZWxlY3Rpb25ZO1xuICAgIGxldCBndWlkZTtcbiAgICBzd2l0Y2ggKHNob3J0Y3V0KSB7XG4gICAgICAgIGNhc2UgU2hvcnRjdXRUeXBlcy5MRUZUOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4IH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLlJJR0hUOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4ICsgd2lkdGggfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFNob3J0Y3V0VHlwZXMuVkVSVElDQUxfQ0VOVEVSOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4ICsgKHdpZHRoIC8gMikgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFNob3J0Y3V0VHlwZXMuVE9QOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdZJywgb2Zmc2V0OiB5IH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLkhPUklaT05UQUxfQ0VOVEVSOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdZJywgb2Zmc2V0OiB5ICsgKGhlaWdodCAvIDIpIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLkJPVFRPTTpcbiAgICAgICAgICAgIGd1aWRlID0geyBheGlzOiAnWScsIG9mZnNldDogeSArIGhlaWdodCB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU2hvcnRjdXRUeXBlcy5DTEVBUjpcbiAgICAgICAgICAgIGZyYW1lLmd1aWRlcyA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmhhbmRsZWQgc2hvcnRjdXQ6ICR7c2hvcnRjdXR9YCk7XG4gICAgfVxuICAgIGFkZEd1aWRlKGZyYW1lLCBbZ3VpZGVdKTtcbn07XG5jb25zdCBjYWxjdWxhdGVHdWlkZUJsb2NrID0gKGNvdW50LCBzaXplLCBzdGFydCwgZ3V0dGVyLCBheGlzKSA9PiB7XG4gICAgY29uc3QgZ3VpZGVzID0gW107XG4gICAgbGV0IG5leHRTdGFydCA9IHN0YXJ0ICsgc2l6ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgaWYgKGkgPT09IDEgfHwgaSA9PT0gY291bnQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGd1aWRlcy5wdXNoKHtcbiAgICAgICAgICAgIGF4aXMsXG4gICAgICAgICAgICBvZmZzZXQ6IG5leHRTdGFydCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChndXR0ZXIpIHtcbiAgICAgICAgICAgIGd1aWRlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBheGlzLFxuICAgICAgICAgICAgICAgIG9mZnNldDogbmV4dFN0YXJ0ICsgZ3V0dGVyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXh0U3RhcnQgPSBuZXh0U3RhcnQgKyBndXR0ZXIgKyBzaXplO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dFN0YXJ0ICs9IHNpemU7XG4gICAgfVxuICAgIHJldHVybiBndWlkZXM7XG59O1xuY29uc3QgaGFuZGxlQWRkR3VpZGVzID0gKGZvcm1EYXRhKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb24gfSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb25bMF07XG4gICAgY29uc3QgZnJhbWUgPSBmaW5kRnJhbWUoY3VycmVudFNlbGVjdGlvbik7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCB4OiBzZWxlY3Rpb25YLCB5OiBzZWxlY3Rpb25ZIH0gPSBjdXJyZW50U2VsZWN0aW9uO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWRGcmFtZSA9IGZyYW1lID09PSBjdXJyZW50U2VsZWN0aW9uO1xuICAgIGNvbnN0IHggPSBpc1NlbGVjdGVkRnJhbWUgPyAwIDogc2VsZWN0aW9uWDtcbiAgICBjb25zdCB5ID0gaXNTZWxlY3RlZEZyYW1lID8gMCA6IHNlbGVjdGlvblk7XG4gICAgY29uc3QgZm9ybURhdGFPYmplY3QgPSBmb3JtRGF0YS5yZWR1Y2UoKGFjYywgeyBpZCwgdmFsdWUgfSkgPT4gKE9iamVjdC5hc3NpZ24oe30sIGFjYywgeyBbaWRdOiB2YWx1ZSB9KSksIHt9KTtcbiAgICBjb25zdCBtYXJnaW5HdWlkZXMgPSBmb3JtRGF0YS5tYXAoKHsgaWQsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLlRPUF9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1knLCBvZmZzZXQ6IHkgKyB2YWx1ZSB9O1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLkJPVFRPTV9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1knLCBvZmZzZXQ6IHkgKyAoaGVpZ2h0IC0gdmFsdWUpIH07XG4gICAgICAgICAgICBjYXNlIEZvcm1JbnB1dHMuTEVGVF9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1gnLCBvZmZzZXQ6IHggKyB2YWx1ZSB9O1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLlJJR0hUX01BUkdJTjpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBheGlzOiAnWCcsIG9mZnNldDogeCArICh3aWR0aCAtIHZhbHVlKSB9O1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGNvbnN0IHJvd0d1dHRlciA9IGZvcm1EYXRhT2JqZWN0W0Zvcm1JbnB1dHMuSE9SSVpPTlRBTF9HVVRURVJdO1xuICAgIGNvbnN0IGNvbHVtbkd1dHRlciA9IGZvcm1EYXRhT2JqZWN0W0Zvcm1JbnB1dHMuVkVSVElDQUxfR1VUVEVSXTtcbiAgICBjb25zdCBsZWZ0TWFyZ2luID0gZm9ybURhdGFPYmplY3RbRm9ybUlucHV0cy5MRUZUX01BUkdJTl07XG4gICAgY29uc3QgcmlnaHRNYXJnaW4gPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLlJJR0hUX01BUkdJTl07XG4gICAgY29uc3QgdG9wTWFyZ2luID0gZm9ybURhdGFPYmplY3RbRm9ybUlucHV0cy5UT1BfTUFSR0lOXTtcbiAgICBjb25zdCBib3R0b21NYXJnaW4gPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLkJPVFRPTV9NQVJHSU5dO1xuICAgIGNvbnN0IGNvbHVtbnMgPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLk5PX09GX0NPTFVNTlNdO1xuICAgIGNvbnN0IHJvd3MgPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLk5PX09GX1JPV1NdO1xuICAgIGNvbnN0IGNvbHVtbldpZHRoID0gTWF0aC5yb3VuZCgod2lkdGggLSAobGVmdE1hcmdpbiArIHJpZ2h0TWFyZ2luICsgKChjb2x1bW5zIC0gMSkgKiBjb2x1bW5HdXR0ZXIpKSkgLyBjb2x1bW5zKTtcbiAgICBjb25zdCByb3dIZWlnaHQgPSBNYXRoLnJvdW5kKChoZWlnaHQgLSAodG9wTWFyZ2luICsgYm90dG9tTWFyZ2luICsgKChyb3dzIC0gMSkgKiByb3dHdXR0ZXIpKSkgLyByb3dzKTtcbiAgICBjb25zdCBjb2x1bW5HdWlkZXMgPSBjYWxjdWxhdGVHdWlkZUJsb2NrKGNvbHVtbnMsIGNvbHVtbldpZHRoLCB4ICsgbGVmdE1hcmdpbiwgY29sdW1uR3V0dGVyLCAnWCcpO1xuICAgIGNvbnN0IHJvd0d1aWRlcyA9IGNhbGN1bGF0ZUd1aWRlQmxvY2socm93cywgcm93SGVpZ2h0LCB5ICsgdG9wTWFyZ2luLCByb3dHdXR0ZXIsICdZJyk7XG4gICAgYWRkR3VpZGUoZnJhbWUsIFsuLi5tYXJnaW5HdWlkZXMsIC4uLmNvbHVtbkd1aWRlcywgLi4ucm93R3VpZGVzXSk7XG59O1xuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgIGNoZWNrU2VsZWN0aW9uKCk7XG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlcy5TSE9SVENVVFM6XG4gICAgICAgICAgICBoYW5kbGVTaG9ydGN1dHMobXNnLmRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTWVzc2FnZVR5cGVzLkFERF9HVUlERVM6XG4gICAgICAgICAgICBoYW5kbGVBZGRHdWlkZXMobXNnLmRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgfVxufTtcbiIsImV4cG9ydCB2YXIgU2hvcnRjdXRUeXBlcztcbihmdW5jdGlvbiAoU2hvcnRjdXRUeXBlcykge1xuICAgIFNob3J0Y3V0VHlwZXNbU2hvcnRjdXRUeXBlc1tcIlVOS05PV05cIl0gPSAwXSA9IFwiVU5LTk9XTlwiO1xuICAgIFNob3J0Y3V0VHlwZXNbU2hvcnRjdXRUeXBlc1tcIkxFRlRcIl0gPSAxXSA9IFwiTEVGVFwiO1xuICAgIFNob3J0Y3V0VHlwZXNbU2hvcnRjdXRUeXBlc1tcIlZFUlRJQ0FMX0NFTlRFUlwiXSA9IDJdID0gXCJWRVJUSUNBTF9DRU5URVJcIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJSSUdIVFwiXSA9IDNdID0gXCJSSUdIVFwiO1xuICAgIFNob3J0Y3V0VHlwZXNbU2hvcnRjdXRUeXBlc1tcIlRPUFwiXSA9IDRdID0gXCJUT1BcIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJIT1JJWk9OVEFMX0NFTlRFUlwiXSA9IDVdID0gXCJIT1JJWk9OVEFMX0NFTlRFUlwiO1xuICAgIFNob3J0Y3V0VHlwZXNbU2hvcnRjdXRUeXBlc1tcIkJPVFRPTVwiXSA9IDZdID0gXCJCT1RUT01cIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJDTEVBUlwiXSA9IDddID0gXCJDTEVBUlwiO1xufSkoU2hvcnRjdXRUeXBlcyB8fCAoU2hvcnRjdXRUeXBlcyA9IHt9KSk7XG5leHBvcnQgdmFyIE1lc3NhZ2VUeXBlcztcbihmdW5jdGlvbiAoTWVzc2FnZVR5cGVzKSB7XG4gICAgTWVzc2FnZVR5cGVzW01lc3NhZ2VUeXBlc1tcIlVOS05PV05cIl0gPSAwXSA9IFwiVU5LTk9XTlwiO1xuICAgIE1lc3NhZ2VUeXBlc1tNZXNzYWdlVHlwZXNbXCJTSE9SVENVVFNcIl0gPSAxXSA9IFwiU0hPUlRDVVRTXCI7XG4gICAgTWVzc2FnZVR5cGVzW01lc3NhZ2VUeXBlc1tcIkFERF9HVUlERVNcIl0gPSAyXSA9IFwiQUREX0dVSURFU1wiO1xufSkoTWVzc2FnZVR5cGVzIHx8IChNZXNzYWdlVHlwZXMgPSB7fSkpO1xuZXhwb3J0IHZhciBGb3JtSW5wdXRzO1xuKGZ1bmN0aW9uIChGb3JtSW5wdXRzKSB7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiVU5LTk9XTlwiXSA9IDBdID0gXCJVTktOT1dOXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiTEVGVF9NQVJHSU5cIl0gPSAxXSA9IFwiTEVGVF9NQVJHSU5cIjtcbiAgICBGb3JtSW5wdXRzW0Zvcm1JbnB1dHNbXCJSSUdIVF9NQVJHSU5cIl0gPSAyXSA9IFwiUklHSFRfTUFSR0lOXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiVE9QX01BUkdJTlwiXSA9IDNdID0gXCJUT1BfTUFSR0lOXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiQk9UVE9NX01BUkdJTlwiXSA9IDRdID0gXCJCT1RUT01fTUFSR0lOXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiTk9fT0ZfQ09MVU1OU1wiXSA9IDVdID0gXCJOT19PRl9DT0xVTU5TXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiTk9fT0ZfUk9XU1wiXSA9IDZdID0gXCJOT19PRl9ST1dTXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiV0lEVEhcIl0gPSA3XSA9IFwiV0lEVEhcIjtcbiAgICBGb3JtSW5wdXRzW0Zvcm1JbnB1dHNbXCJIRUlHSFRcIl0gPSA4XSA9IFwiSEVJR0hUXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiVkVSVElDQUxfR1VUVEVSXCJdID0gOV0gPSBcIlZFUlRJQ0FMX0dVVFRFUlwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIkhPUklaT05UQUxfR1VUVEVSXCJdID0gMTBdID0gXCJIT1JJWk9OVEFMX0dVVFRFUlwiO1xufSkoRm9ybUlucHV0cyB8fCAoRm9ybUlucHV0cyA9IHt9KSk7XG4iXSwic291cmNlUm9vdCI6IiJ9