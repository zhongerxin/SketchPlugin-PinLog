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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports["default"] = function (context) {
  var doc = context.document;
  var docData = doc.documentData();
  var command = context.command;
  var pages = doc.pages();
  var view = doc.currentView();
  var newViewportFrame = view.frame();
  var windowFrame = doc.documentWindow().frame();
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "twox.floatingexample";

  // 获取数据  

  var positions = command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier');
  if (positions == null) {
    positions = "";
  } else {
    positions = command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier');
  }

  // If there's already a panel, prevent the plugin from running
  if (threadDictionary[identifier]) return;

  // Panel --------------------------------------------------
  // size
  var panelWidth = 240;
  var panelHeight = 444;

  // style
  var panel = NSPanel.alloc().init();
  panelX = windowFrame.size.width - (windowFrame.size.width - newViewportFrame.size.width) / 2 - panelWidth + windowFrame.origin.x;
  panelY = newViewportFrame.size.height - panelHeight + windowFrame.origin.y;
  panel.setFrame_display(NSMakeRect(panelX, panelY, panelWidth, panelHeight), true);
  panel.setBackgroundColor(NSColor.whiteColor());
  panel.title = "Pin Log";
  panel.titlebarAppearsTransparent = true;
  //panel.center();
  panel.makeKeyAndOrderFront(null);
  panel.setLevel(NSFloatingWindowLevel);

  // setID
  threadDictionary[identifier] = panel;

  // Make the plugin's code stick around (since it's a floating panel)
  COScript.currentCOScript().setShouldKeepAround_(true);

  // Hide the Minimize and Zoom button
  panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  panel.standardWindowButton(NSWindowZoomButton).setHidden(true);

  // Create the blurred background
  var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
  vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
  vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);
  panel.contentView().addSubview(vibrancy);

  // Assign a function to the Close button
  var closeButton = panel.standardWindowButton(NSWindowCloseButton);
  closeButton.setCOSJSTargetFunction(function (sender) {
    panel.close();
    threadDictionary.removeObjectForKey(identifier);
    COScript.currentCOScript().setShouldKeepAround_(false);
  });

  // WebView
  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight - 22));
  var request = NSURLRequest.requestWithURL(context.plugin.urlForResourceNamed("webView.html"));
  webView.mainFrame().loadRequest(request);
  webView.setDrawsBackground(false);

  // WebView comunication
  var windowObject = webView.windowScriptObject();
  var delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:": function () {
      function webViewDidFinishLoadForFrame(webView, webFrame) {
        windowObject.evaluateWebScript("updatePreview('" + positions + "')");
      }

      return webViewDidFinishLoadForFrame;
    }(),

    // Listen to URL changes
    "webView:didChangeLocationWithinPageForFrame:": function () {
      function webViewDidChangeLocationWithinPageForFrame(webView, webFrame) {

        var hash = windowObject.evaluateWebScript("window.location.hash.substring(1)");
        hash = decodeURIComponent(hash);

        // Parse the hash's JSON content 
        var data = JSON.parse(hash);
        var type = data.type;
        switch (type) {
          case "goPosition":
            goPosition(data);
            break;
          case "addPin":
            addPin();
            break;
          case "deletePin":
            deletePin(data);
            break;
          case "editPin":
            editPin(data);
            break;
          case "clearAll":
            clearAll();
            break;
        }
      }

      return webViewDidChangeLocationWithinPageForFrame;
    }()
  });

  webView.setFrameLoadDelegate_(delegate.getClassInstance());

  // Add WebView
  panel.contentView().addSubview(webView);

  // functions------------------------

  // zoom to right place
  function goPosition(data) {
    var position = data.position;
    var pageID = position.page;
    pages.forEach(function (page) {
      var currentID = String(page.objectID());
      if (currentID == pageID) {
        doc.setCurrentPage(page);
      }
    });
    var newScrollX = position.scroll.x - (position.viewFrame.width - newViewportFrame.size.width) / 2;
    var newScrollY = position.scroll.y - (position.viewFrame.height - newViewportFrame.size.height) / 2;
    var newOrigin = NSMakePoint(newScrollX, newScrollY);
    var newZoomValue = position.zoom;
    view.animateToZoom(newZoomValue);
    view.animateScrollOriginToPoint(newOrigin);
  }

  function clearAll() {
    var positions = null;
    command.setValue_forKey_onLayer_forPluginIdentifier(positions, 'positions', docData, 'my-command-identifier');
    doc.showMessage("Clear All");
  }

  function deletePin(data) {
    positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
    var id = Number(data.index);
    positions.splice(id, 1);
    command.setValue_forKey_onLayer_forPluginIdentifier(JSON.stringify(positions), 'positions', docData, 'my-command-identifier');
    doc.showMessage("Delete successfully");
  }

  function editPin(data) {
    positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
    var id = Number(data.index);
    var info = data.info;
    //alert
    var alert = COSAlertWindow["new"]();
    alert.setIcon(iconImage);
    alert.setMessageText("Edit a pin");
    alert.addButtonWithTitle("Save");
    alert.addButtonWithTitle("Cancel");
    alert.setInformativeText("Edit the note for the original artboard location");

    var viewWidth = 400;
    var viewHeight = 90;
    var alertView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    var field = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 80, viewWidth - 102, 80));

    field.setStringValue(info);
    alertView.addSubview(field);
    alert.alert().window().setInitialFirstResponder(field);
    alert.addAccessoryView(alertView);
    var response = alert.runModal();

    if (response == 1000) {
      var newPosition = positions[id];
      newPosition.info = String(field.stringValue());
      positions.splice(id, 1, newPosition);
      command.setValue_forKey_onLayer_forPluginIdentifier(JSON.stringify(positions), 'positions', docData, 'my-command-identifier');
      doc.showMessage("Edit successfully");
      var newInfo = {
        "info": newPosition.info
      };
      var newInfoString = JSON.stringify(newInfo);
      windowObject.evaluateWebScript("updateEditPin('" + newInfoString + "')");
    }
  }

  function addPin() {
    var docData = doc.documentData();
    var command = context.command;
    var pages = doc.pages();
    var view = doc.currentView();
    var scrollOrigin = doc.scrollOrigin();
    var viewportFrame = view.frame();
    var zoomValue = doc.zoomValue();
    var positions = command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier');
    var page = doc.currentPage();
    var pageID = page.objectID();
    // alert
    var alert = COSAlertWindow["new"]();
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
        //positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
      } else {
        positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
        positions.push(newPosition);
        command.setValue_forKey_onLayer_forPluginIdentifier(JSON.stringify(positions), 'positions', docData, 'my-command-identifier');
        //positions = JSON.parse(command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier'));
      }
      positions = command.valueForKey_onLayer_forPluginIdentifier('positions', docData, 'my-command-identifier');
      windowObject.evaluateWebScript("addLastPin('" + positions + "')");
      doc.showMessage("Pin Added");
    } else {
      return;
    }
  }
};

var MochaJSDelegate = function MochaJSDelegate(selectorHandlerDict) {
  var uniqueClassName = "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString();

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, NSObject);

  delegateClassDesc.registerClass();

  //	Handler storage

  var handlers = {};

  //	Define interface

  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);

    handlers[selectorString] = func;

    if (!handlerHasBeenSet) {

      var dynamicHandler = function dynamicHandler() {
        var functionToCall = handlers[selectorString];

        if (!functionToCall) return;

        return functionToCall.apply(delegateClassDesc, arguments);
      };

      var args = [],
          regex = /:/g;
      while (match = regex.exec(selectorString)) {
        args.push("arg" + args.length);
      }dynamicFunction = eval("(function(" + args.join(",") + "){ return dynamicHandler.apply(this, arguments); })");

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
    }
  };

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString];
  };

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString];
  };

  this.getAllHandlers = function () {
    return handlers;
  };

  this.getClass = function () {
    return NSClassFromString(uniqueClassName);
  };

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName)["new"]();
  };

  //	Conveience

  if ((typeof selectorHandlerDict === "undefined" ? "undefined" : _typeof(selectorHandlerDict)) == "object") {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
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
