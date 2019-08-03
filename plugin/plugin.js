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

// Initial the plugin UI.
figma.showUI(__html__);
// Rezise the plugin UI to the desired size.
figma.ui.resize(350, 370);
/**
 * Removes duplicates and adds an array of unique guides to the given frame node.
 * @param frame Figma frame node
 * @param guides Array of guides including duplicate guides to be added in to the given frame.
 */
const addGuide = (frame, guides) => {
    const guideString = ({ axis, offset }) => `${axis}_${offset}`;
    const existingGuidesLookupMap = frame.guides.map(guideString);
    const filteredGuides = guides.filter((guide) => !existingGuidesLookupMap.includes(guideString(guide)));
    // eslint-disable-next-line no-param-reassign
    frame.guides = frame.guides.concat(filteredGuides);
};
/**
 * Returns the frame node if found initially or recursively fetch the parent till frame
 * node is found.
 * @param node Current selection node.
 */
const findFrame = (node) => {
    if (node.type === 'FRAME') {
        return node;
    }
    return findFrame(node.parent);
};
/**
 * Returns the current user selected node else returns the frame node when only one frame is found
 * in the tab. Throws an error when no frame or more than one frame is found in the tab.
 */
const getSelection = () => {
    const { selection } = figma.currentPage;
    const currentSelection = selection[0];
    if (currentSelection) {
        return currentSelection;
    }
    const frames = figma.currentPage.findAll((node) => node.type === 'FRAME');
    if (frames.length === 1) {
        return frames[0];
    }
    if (frames.length > 1) {
        throw Error('Multiple frames detected. Select one layer or frame to use Guide Mate.');
    }
    throw Error('Add at least one frame to use Guide Mate.');
};
/**
 * Adds guides based on the shortcut selection.
 * @param shortcut
 */
const handleShortcuts = (shortcut) => {
    const currentSelection = getSelection();
    const frame = findFrame(currentSelection);
    const { width, height, x: selectionX, y: selectionY, } = currentSelection;
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
            // If the shortcut is clear, clear all the guides in the selected frame and do not proceed
            // further.
            frame.guides = [];
            return;
        default:
            console.warn(`Unhandled shortcut: ${shortcut}`);
    }
    addGuide(frame, [guide]);
};
/**
 * Computes and returns incremental guides width/length and their position with gutter space
 * considered.
 * @param count Total number of guide blocks to be added.
 * @param size Width or height of each guide block.
 * @param start Starting point of the first guide block.
 * @param gutter Gutter space between two guide blocks.
 * @param axis Axis to which the guide block should be added.
 */
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
/**
 * Adds guides to the selected frame based on the user supplied form data.
 * @param formData User input object containing the form values.
 */
const handleAddGuides = (formData) => {
    const currentSelection = getSelection();
    const frame = findFrame(currentSelection);
    const { width, height, x: selectionX, y: selectionY, } = currentSelection;
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
/**
 * Handles all messages from parent.
 */
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case _types__WEBPACK_IMPORTED_MODULE_0__["MessageTypes"].SHORTCUTS:
            handleShortcuts(msg.data);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["MessageTypes"].ADD_GUIDES:
            handleAddGuides(msg.data);
            break;
        default:
            console.warn(`Unhandled message type: ${msg.type}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGVBQWUsUUFBUSxLQUFLLEdBQUcsT0FBTztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsK0NBQStDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG9EQUFhO0FBQzFCLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWEsb0RBQWE7QUFDMUIscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYSxvREFBYTtBQUMxQixxQkFBcUI7QUFDckI7QUFDQSxhQUFhLG9EQUFhO0FBQzFCLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWEsb0RBQWE7QUFDMUIscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYSxvREFBYTtBQUMxQixxQkFBcUI7QUFDckI7QUFDQSxhQUFhLG9EQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsK0NBQStDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxZQUFZLHNCQUFzQixRQUFRLGNBQWMsTUFBTTtBQUNoSCx3Q0FBd0MsWUFBWTtBQUNwRDtBQUNBLGlCQUFpQixpREFBVTtBQUMzQix3QkFBd0I7QUFDeEIsaUJBQWlCLGlEQUFVO0FBQzNCLHdCQUF3QjtBQUN4QixpQkFBaUIsaURBQVU7QUFDM0Isd0JBQXdCO0FBQ3hCLGlCQUFpQixpREFBVTtBQUMzQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHFDQUFxQyxpREFBVTtBQUMvQyx3Q0FBd0MsaURBQVU7QUFDbEQsc0NBQXNDLGlEQUFVO0FBQ2hELHVDQUF1QyxpREFBVTtBQUNqRCxxQ0FBcUMsaURBQVU7QUFDL0Msd0NBQXdDLGlEQUFVO0FBQ2xELG1DQUFtQyxpREFBVTtBQUM3QyxnQ0FBZ0MsaURBQVU7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbURBQVk7QUFDekI7QUFDQTtBQUNBLGFBQWEsbURBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFNBQVM7QUFDN0Q7QUFDQTs7Ozs7Ozs7Ozs7OztBQzlLQTtBQUFBO0FBQUE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzQ0FBc0M7QUFDaEM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsb0NBQW9DO0FBQzlCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxnQ0FBZ0MiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi50c1wiKTtcbiIsImltcG9ydCB7IFNob3J0Y3V0VHlwZXMsIE1lc3NhZ2VUeXBlcywgRm9ybUlucHV0cywgfSBmcm9tICcuL3R5cGVzJztcbi8vIEluaXRpYWwgdGhlIHBsdWdpbiBVSS5cbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG4vLyBSZXppc2UgdGhlIHBsdWdpbiBVSSB0byB0aGUgZGVzaXJlZCBzaXplLlxuZmlnbWEudWkucmVzaXplKDM1MCwgMzcwKTtcbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGVzIGFuZCBhZGRzIGFuIGFycmF5IG9mIHVuaXF1ZSBndWlkZXMgdG8gdGhlIGdpdmVuIGZyYW1lIG5vZGUuXG4gKiBAcGFyYW0gZnJhbWUgRmlnbWEgZnJhbWUgbm9kZVxuICogQHBhcmFtIGd1aWRlcyBBcnJheSBvZiBndWlkZXMgaW5jbHVkaW5nIGR1cGxpY2F0ZSBndWlkZXMgdG8gYmUgYWRkZWQgaW4gdG8gdGhlIGdpdmVuIGZyYW1lLlxuICovXG5jb25zdCBhZGRHdWlkZSA9IChmcmFtZSwgZ3VpZGVzKSA9PiB7XG4gICAgY29uc3QgZ3VpZGVTdHJpbmcgPSAoeyBheGlzLCBvZmZzZXQgfSkgPT4gYCR7YXhpc31fJHtvZmZzZXR9YDtcbiAgICBjb25zdCBleGlzdGluZ0d1aWRlc0xvb2t1cE1hcCA9IGZyYW1lLmd1aWRlcy5tYXAoZ3VpZGVTdHJpbmcpO1xuICAgIGNvbnN0IGZpbHRlcmVkR3VpZGVzID0gZ3VpZGVzLmZpbHRlcigoZ3VpZGUpID0+ICFleGlzdGluZ0d1aWRlc0xvb2t1cE1hcC5pbmNsdWRlcyhndWlkZVN0cmluZyhndWlkZSkpKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBmcmFtZS5ndWlkZXMgPSBmcmFtZS5ndWlkZXMuY29uY2F0KGZpbHRlcmVkR3VpZGVzKTtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIGZyYW1lIG5vZGUgaWYgZm91bmQgaW5pdGlhbGx5IG9yIHJlY3Vyc2l2ZWx5IGZldGNoIHRoZSBwYXJlbnQgdGlsbCBmcmFtZVxuICogbm9kZSBpcyBmb3VuZC5cbiAqIEBwYXJhbSBub2RlIEN1cnJlbnQgc2VsZWN0aW9uIG5vZGUuXG4gKi9cbmNvbnN0IGZpbmRGcmFtZSA9IChub2RlKSA9PiB7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJykge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmRGcmFtZShub2RlLnBhcmVudCk7XG59O1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IHVzZXIgc2VsZWN0ZWQgbm9kZSBlbHNlIHJldHVybnMgdGhlIGZyYW1lIG5vZGUgd2hlbiBvbmx5IG9uZSBmcmFtZSBpcyBmb3VuZFxuICogaW4gdGhlIHRhYi4gVGhyb3dzIGFuIGVycm9yIHdoZW4gbm8gZnJhbWUgb3IgbW9yZSB0aGFuIG9uZSBmcmFtZSBpcyBmb3VuZCBpbiB0aGUgdGFiLlxuICovXG5jb25zdCBnZXRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb24gfSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb25bMF07XG4gICAgaWYgKGN1cnJlbnRTZWxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3Rpb247XG4gICAgfVxuICAgIGNvbnN0IGZyYW1lcyA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyk7XG4gICAgaWYgKGZyYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGZyYW1lc1swXTtcbiAgICB9XG4gICAgaWYgKGZyYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdNdWx0aXBsZSBmcmFtZXMgZGV0ZWN0ZWQuIFNlbGVjdCBvbmUgbGF5ZXIgb3IgZnJhbWUgdG8gdXNlIEd1aWRlIE1hdGUuJyk7XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdBZGQgYXQgbGVhc3Qgb25lIGZyYW1lIHRvIHVzZSBHdWlkZSBNYXRlLicpO1xufTtcbi8qKlxuICogQWRkcyBndWlkZXMgYmFzZWQgb24gdGhlIHNob3J0Y3V0IHNlbGVjdGlvbi5cbiAqIEBwYXJhbSBzaG9ydGN1dFxuICovXG5jb25zdCBoYW5kbGVTaG9ydGN1dHMgPSAoc2hvcnRjdXQpID0+IHtcbiAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3QgZnJhbWUgPSBmaW5kRnJhbWUoY3VycmVudFNlbGVjdGlvbik7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCB4OiBzZWxlY3Rpb25YLCB5OiBzZWxlY3Rpb25ZLCB9ID0gY3VycmVudFNlbGVjdGlvbjtcbiAgICBjb25zdCBpc1NlbGVjdGVkRnJhbWUgPSBmcmFtZSA9PT0gY3VycmVudFNlbGVjdGlvbjtcbiAgICBjb25zdCB4ID0gaXNTZWxlY3RlZEZyYW1lID8gMCA6IHNlbGVjdGlvblg7XG4gICAgY29uc3QgeSA9IGlzU2VsZWN0ZWRGcmFtZSA/IDAgOiBzZWxlY3Rpb25ZO1xuICAgIGxldCBndWlkZTtcbiAgICBzd2l0Y2ggKHNob3J0Y3V0KSB7XG4gICAgICAgIGNhc2UgU2hvcnRjdXRUeXBlcy5MRUZUOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4IH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLlJJR0hUOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4ICsgd2lkdGggfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFNob3J0Y3V0VHlwZXMuVkVSVElDQUxfQ0VOVEVSOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdYJywgb2Zmc2V0OiB4ICsgKHdpZHRoIC8gMikgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFNob3J0Y3V0VHlwZXMuVE9QOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdZJywgb2Zmc2V0OiB5IH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLkhPUklaT05UQUxfQ0VOVEVSOlxuICAgICAgICAgICAgZ3VpZGUgPSB7IGF4aXM6ICdZJywgb2Zmc2V0OiB5ICsgKGhlaWdodCAvIDIpIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTaG9ydGN1dFR5cGVzLkJPVFRPTTpcbiAgICAgICAgICAgIGd1aWRlID0geyBheGlzOiAnWScsIG9mZnNldDogeSArIGhlaWdodCB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU2hvcnRjdXRUeXBlcy5DTEVBUjpcbiAgICAgICAgICAgIC8vIElmIHRoZSBzaG9ydGN1dCBpcyBjbGVhciwgY2xlYXIgYWxsIHRoZSBndWlkZXMgaW4gdGhlIHNlbGVjdGVkIGZyYW1lIGFuZCBkbyBub3QgcHJvY2VlZFxuICAgICAgICAgICAgLy8gZnVydGhlci5cbiAgICAgICAgICAgIGZyYW1lLmd1aWRlcyA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmhhbmRsZWQgc2hvcnRjdXQ6ICR7c2hvcnRjdXR9YCk7XG4gICAgfVxuICAgIGFkZEd1aWRlKGZyYW1lLCBbZ3VpZGVdKTtcbn07XG4vKipcbiAqIENvbXB1dGVzIGFuZCByZXR1cm5zIGluY3JlbWVudGFsIGd1aWRlcyB3aWR0aC9sZW5ndGggYW5kIHRoZWlyIHBvc2l0aW9uIHdpdGggZ3V0dGVyIHNwYWNlXG4gKiBjb25zaWRlcmVkLlxuICogQHBhcmFtIGNvdW50IFRvdGFsIG51bWJlciBvZiBndWlkZSBibG9ja3MgdG8gYmUgYWRkZWQuXG4gKiBAcGFyYW0gc2l6ZSBXaWR0aCBvciBoZWlnaHQgb2YgZWFjaCBndWlkZSBibG9jay5cbiAqIEBwYXJhbSBzdGFydCBTdGFydGluZyBwb2ludCBvZiB0aGUgZmlyc3QgZ3VpZGUgYmxvY2suXG4gKiBAcGFyYW0gZ3V0dGVyIEd1dHRlciBzcGFjZSBiZXR3ZWVuIHR3byBndWlkZSBibG9ja3MuXG4gKiBAcGFyYW0gYXhpcyBBeGlzIHRvIHdoaWNoIHRoZSBndWlkZSBibG9jayBzaG91bGQgYmUgYWRkZWQuXG4gKi9cbmNvbnN0IGNhbGN1bGF0ZUd1aWRlQmxvY2sgPSAoY291bnQsIHNpemUsIHN0YXJ0LCBndXR0ZXIsIGF4aXMpID0+IHtcbiAgICBjb25zdCBndWlkZXMgPSBbXTtcbiAgICBsZXQgbmV4dFN0YXJ0ID0gc3RhcnQgKyBzaXplO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBpZiAoaSA9PT0gMSB8fCBpID09PSBjb3VudCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZ3VpZGVzLnB1c2goe1xuICAgICAgICAgICAgYXhpcyxcbiAgICAgICAgICAgIG9mZnNldDogbmV4dFN0YXJ0LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGd1dHRlcikge1xuICAgICAgICAgICAgZ3VpZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGF4aXMsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBuZXh0U3RhcnQgKyBndXR0ZXIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5leHRTdGFydCA9IG5leHRTdGFydCArIGd1dHRlciArIHNpemU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0U3RhcnQgKz0gc2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIGd1aWRlcztcbn07XG4vKipcbiAqIEFkZHMgZ3VpZGVzIHRvIHRoZSBzZWxlY3RlZCBmcmFtZSBiYXNlZCBvbiB0aGUgdXNlciBzdXBwbGllZCBmb3JtIGRhdGEuXG4gKiBAcGFyYW0gZm9ybURhdGEgVXNlciBpbnB1dCBvYmplY3QgY29udGFpbmluZyB0aGUgZm9ybSB2YWx1ZXMuXG4gKi9cbmNvbnN0IGhhbmRsZUFkZEd1aWRlcyA9IChmb3JtRGF0YSkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBmcmFtZSA9IGZpbmRGcmFtZShjdXJyZW50U2VsZWN0aW9uKTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIHg6IHNlbGVjdGlvblgsIHk6IHNlbGVjdGlvblksIH0gPSBjdXJyZW50U2VsZWN0aW9uO1xuICAgIGNvbnN0IGlzU2VsZWN0ZWRGcmFtZSA9IGZyYW1lID09PSBjdXJyZW50U2VsZWN0aW9uO1xuICAgIGNvbnN0IHggPSBpc1NlbGVjdGVkRnJhbWUgPyAwIDogc2VsZWN0aW9uWDtcbiAgICBjb25zdCB5ID0gaXNTZWxlY3RlZEZyYW1lID8gMCA6IHNlbGVjdGlvblk7XG4gICAgY29uc3QgZm9ybURhdGFPYmplY3QgPSBmb3JtRGF0YS5yZWR1Y2UoKGFjYywgeyBpZCwgdmFsdWUgfSkgPT4gKE9iamVjdC5hc3NpZ24oe30sIGFjYywgeyBbaWRdOiB2YWx1ZSB9KSksIHt9KTtcbiAgICBjb25zdCBtYXJnaW5HdWlkZXMgPSBmb3JtRGF0YS5tYXAoKHsgaWQsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLlRPUF9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1knLCBvZmZzZXQ6IHkgKyB2YWx1ZSB9O1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLkJPVFRPTV9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1knLCBvZmZzZXQ6IHkgKyAoaGVpZ2h0IC0gdmFsdWUpIH07XG4gICAgICAgICAgICBjYXNlIEZvcm1JbnB1dHMuTEVGVF9NQVJHSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYXhpczogJ1gnLCBvZmZzZXQ6IHggKyB2YWx1ZSB9O1xuICAgICAgICAgICAgY2FzZSBGb3JtSW5wdXRzLlJJR0hUX01BUkdJTjpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBheGlzOiAnWCcsIG9mZnNldDogeCArICh3aWR0aCAtIHZhbHVlKSB9O1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGNvbnN0IHJvd0d1dHRlciA9IGZvcm1EYXRhT2JqZWN0W0Zvcm1JbnB1dHMuSE9SSVpPTlRBTF9HVVRURVJdO1xuICAgIGNvbnN0IGNvbHVtbkd1dHRlciA9IGZvcm1EYXRhT2JqZWN0W0Zvcm1JbnB1dHMuVkVSVElDQUxfR1VUVEVSXTtcbiAgICBjb25zdCBsZWZ0TWFyZ2luID0gZm9ybURhdGFPYmplY3RbRm9ybUlucHV0cy5MRUZUX01BUkdJTl07XG4gICAgY29uc3QgcmlnaHRNYXJnaW4gPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLlJJR0hUX01BUkdJTl07XG4gICAgY29uc3QgdG9wTWFyZ2luID0gZm9ybURhdGFPYmplY3RbRm9ybUlucHV0cy5UT1BfTUFSR0lOXTtcbiAgICBjb25zdCBib3R0b21NYXJnaW4gPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLkJPVFRPTV9NQVJHSU5dO1xuICAgIGNvbnN0IGNvbHVtbnMgPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLk5PX09GX0NPTFVNTlNdO1xuICAgIGNvbnN0IHJvd3MgPSBmb3JtRGF0YU9iamVjdFtGb3JtSW5wdXRzLk5PX09GX1JPV1NdO1xuICAgIGNvbnN0IGNvbHVtbldpZHRoID0gTWF0aC5yb3VuZCgod2lkdGggLSAobGVmdE1hcmdpbiArIHJpZ2h0TWFyZ2luICsgKChjb2x1bW5zIC0gMSkgKiBjb2x1bW5HdXR0ZXIpKSkgLyBjb2x1bW5zKTtcbiAgICBjb25zdCByb3dIZWlnaHQgPSBNYXRoLnJvdW5kKChoZWlnaHQgLSAodG9wTWFyZ2luICsgYm90dG9tTWFyZ2luICsgKChyb3dzIC0gMSkgKiByb3dHdXR0ZXIpKSkgLyByb3dzKTtcbiAgICBjb25zdCBjb2x1bW5HdWlkZXMgPSBjYWxjdWxhdGVHdWlkZUJsb2NrKGNvbHVtbnMsIGNvbHVtbldpZHRoLCB4ICsgbGVmdE1hcmdpbiwgY29sdW1uR3V0dGVyLCAnWCcpO1xuICAgIGNvbnN0IHJvd0d1aWRlcyA9IGNhbGN1bGF0ZUd1aWRlQmxvY2socm93cywgcm93SGVpZ2h0LCB5ICsgdG9wTWFyZ2luLCByb3dHdXR0ZXIsICdZJyk7XG4gICAgYWRkR3VpZGUoZnJhbWUsIFsuLi5tYXJnaW5HdWlkZXMsIC4uLmNvbHVtbkd1aWRlcywgLi4ucm93R3VpZGVzXSk7XG59O1xuLyoqXG4gKiBIYW5kbGVzIGFsbCBtZXNzYWdlcyBmcm9tIHBhcmVudC5cbiAqL1xuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSBNZXNzYWdlVHlwZXMuU0hPUlRDVVRTOlxuICAgICAgICAgICAgaGFuZGxlU2hvcnRjdXRzKG1zZy5kYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlcy5BRERfR1VJREVTOlxuICAgICAgICAgICAgaGFuZGxlQWRkR3VpZGVzKG1zZy5kYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmhhbmRsZWQgbWVzc2FnZSB0eXBlOiAke21zZy50eXBlfWApO1xuICAgIH1cbn07XG4iLCJleHBvcnQgdmFyIFNob3J0Y3V0VHlwZXM7XG4oZnVuY3Rpb24gKFNob3J0Y3V0VHlwZXMpIHtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJVTktOT1dOXCJdID0gMF0gPSBcIlVOS05PV05cIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJMRUZUXCJdID0gMV0gPSBcIkxFRlRcIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJWRVJUSUNBTF9DRU5URVJcIl0gPSAyXSA9IFwiVkVSVElDQUxfQ0VOVEVSXCI7XG4gICAgU2hvcnRjdXRUeXBlc1tTaG9ydGN1dFR5cGVzW1wiUklHSFRcIl0gPSAzXSA9IFwiUklHSFRcIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJUT1BcIl0gPSA0XSA9IFwiVE9QXCI7XG4gICAgU2hvcnRjdXRUeXBlc1tTaG9ydGN1dFR5cGVzW1wiSE9SSVpPTlRBTF9DRU5URVJcIl0gPSA1XSA9IFwiSE9SSVpPTlRBTF9DRU5URVJcIjtcbiAgICBTaG9ydGN1dFR5cGVzW1Nob3J0Y3V0VHlwZXNbXCJCT1RUT01cIl0gPSA2XSA9IFwiQk9UVE9NXCI7XG4gICAgU2hvcnRjdXRUeXBlc1tTaG9ydGN1dFR5cGVzW1wiQ0xFQVJcIl0gPSA3XSA9IFwiQ0xFQVJcIjtcbn0pKFNob3J0Y3V0VHlwZXMgfHwgKFNob3J0Y3V0VHlwZXMgPSB7fSkpO1xuZXhwb3J0IHZhciBNZXNzYWdlVHlwZXM7XG4oZnVuY3Rpb24gKE1lc3NhZ2VUeXBlcykge1xuICAgIE1lc3NhZ2VUeXBlc1tNZXNzYWdlVHlwZXNbXCJVTktOT1dOXCJdID0gMF0gPSBcIlVOS05PV05cIjtcbiAgICBNZXNzYWdlVHlwZXNbTWVzc2FnZVR5cGVzW1wiU0hPUlRDVVRTXCJdID0gMV0gPSBcIlNIT1JUQ1VUU1wiO1xuICAgIE1lc3NhZ2VUeXBlc1tNZXNzYWdlVHlwZXNbXCJBRERfR1VJREVTXCJdID0gMl0gPSBcIkFERF9HVUlERVNcIjtcbn0pKE1lc3NhZ2VUeXBlcyB8fCAoTWVzc2FnZVR5cGVzID0ge30pKTtcbmV4cG9ydCB2YXIgRm9ybUlucHV0cztcbihmdW5jdGlvbiAoRm9ybUlucHV0cykge1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIlVOS05PV05cIl0gPSAwXSA9IFwiVU5LTk9XTlwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIkxFRlRfTUFSR0lOXCJdID0gMV0gPSBcIkxFRlRfTUFSR0lOXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiUklHSFRfTUFSR0lOXCJdID0gMl0gPSBcIlJJR0hUX01BUkdJTlwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIlRPUF9NQVJHSU5cIl0gPSAzXSA9IFwiVE9QX01BUkdJTlwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIkJPVFRPTV9NQVJHSU5cIl0gPSA0XSA9IFwiQk9UVE9NX01BUkdJTlwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIk5PX09GX0NPTFVNTlNcIl0gPSA1XSA9IFwiTk9fT0ZfQ09MVU1OU1wiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIk5PX09GX1JPV1NcIl0gPSA2XSA9IFwiTk9fT0ZfUk9XU1wiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIldJRFRIXCJdID0gN10gPSBcIldJRFRIXCI7XG4gICAgRm9ybUlucHV0c1tGb3JtSW5wdXRzW1wiSEVJR0hUXCJdID0gOF0gPSBcIkhFSUdIVFwiO1xuICAgIEZvcm1JbnB1dHNbRm9ybUlucHV0c1tcIlZFUlRJQ0FMX0dVVFRFUlwiXSA9IDldID0gXCJWRVJUSUNBTF9HVVRURVJcIjtcbiAgICBGb3JtSW5wdXRzW0Zvcm1JbnB1dHNbXCJIT1JJWk9OVEFMX0dVVFRFUlwiXSA9IDEwXSA9IFwiSE9SSVpPTlRBTF9HVVRURVJcIjtcbn0pKEZvcm1JbnB1dHMgfHwgKEZvcm1JbnB1dHMgPSB7fSkpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==