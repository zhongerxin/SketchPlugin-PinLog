var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context) {
  var doc = context.document;
  var docData = doc.documentData();
  var command = context.command;
  var pages = doc.pages();
  var view = doc.contentDrawView();
  var scrollOrigin = doc.scrollOrigin();
  var viewportFrame = view.frame();
  var zoomValue = doc.zoomValue();
  var positions = command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier');
  var page = doc.currentPage();
  var pageID = page.objectID();

  // alert
  var alert = COSAlertWindow['new']();
  alert.setIcon(iconImage);
  alert.setMessageText("Pin a location");
  alert.addButtonWithTitle("Save");
  alert.addButtonWithTitle("Cancel");
  alert.setInformativeText("Write a short description of the edits you made");

  var viewWidth = 400;
  var viewHeight = 90;
  var alertView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));

  var field = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 80, viewWidth - 102, 80));
  field.placeholderString = "Add a note for the current location";

  alertView.addSubview(field);
  alert.alert().window().setInitialFirstResponder(field);
  alert.addAccessoryView(alertView);
  var response = alert.runModal();

  if (response == 1000) {
    var info = field.stringValue();
    var newPosition = {
      "scroll": {
        "x": Number(scrollOrigin.x),
        "y": Number(scrollOrigin.y)
      },
      "viewFrame": {
        "x": Number(viewportFrame.origin.x),
        "y": Number(viewportFrame.origin.y),
        "width": Number(viewportFrame.size.width),
        "height": Number(viewportFrame.size.height)
      },
      "zoom": Number(zoomValue),
      "page": String(pageID),
      "info": String(info)
    };
    if (positions == null) {
      command.setValue_forKey_onLayer_forPluginIdentifier(JSON.stringify([newPosition]), 'positions', docData, 'my-command-identifier');
    } else {
      positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
      positions.push(newPosition);
      command.setValue_forKey_onLayer_forPluginIdentifier(JSON.stringify(positions), 'positions', docData, 'my-command-identifier');
    }
    doc.showMessage("Pin Added");
  } else {
    return;
  }
};

var iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path());

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
