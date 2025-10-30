// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It should return a JS Array containing 2 elements. The first
  //   should be the bytes for the wasm module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The second
  //   should be the result of using the JS 'import' API on the js file path.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _3: (o, t) => typeof o === t,
      _4: (o, c) => o instanceof c,
      _7: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._7(f,arguments.length,x0) }),
      _8: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._8(f,arguments.length,x0,x1) }),
      _37: x0 => new Array(x0),
      _39: x0 => x0.length,
      _41: (x0,x1) => x0[x1],
      _42: (x0,x1,x2) => { x0[x1] = x2 },
      _43: x0 => new Promise(x0),
      _45: (x0,x1,x2) => new DataView(x0,x1,x2),
      _47: x0 => new Int8Array(x0),
      _48: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _49: x0 => new Uint8Array(x0),
      _51: x0 => new Uint8ClampedArray(x0),
      _53: x0 => new Int16Array(x0),
      _55: x0 => new Uint16Array(x0),
      _57: x0 => new Int32Array(x0),
      _59: x0 => new Uint32Array(x0),
      _61: x0 => new Float32Array(x0),
      _63: x0 => new Float64Array(x0),
      _65: (x0,x1,x2) => x0.call(x1,x2),
      _70: (decoder, codeUnits) => decoder.decode(codeUnits),
      _71: () => new TextDecoder("utf-8", {fatal: true}),
      _72: () => new TextDecoder("utf-8", {fatal: false}),
      _73: (s) => +s,
      _74: x0 => new Uint8Array(x0),
      _75: (x0,x1,x2) => x0.set(x1,x2),
      _76: (x0,x1) => x0.transferFromImageBitmap(x1),
      _78: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._78(f,arguments.length,x0) }),
      _79: x0 => new window.FinalizationRegistry(x0),
      _80: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _81: (x0,x1) => x0.unregister(x1),
      _82: (x0,x1,x2) => x0.slice(x1,x2),
      _83: (x0,x1) => x0.decode(x1),
      _84: (x0,x1) => x0.segment(x1),
      _85: () => new TextDecoder(),
      _87: x0 => x0.click(),
      _88: x0 => x0.buffer,
      _89: x0 => x0.wasmMemory,
      _90: () => globalThis.window._flutter_skwasmInstance,
      _91: x0 => x0.rasterStartMilliseconds,
      _92: x0 => x0.rasterEndMilliseconds,
      _93: x0 => x0.imageBitmaps,
      _120: x0 => x0.remove(),
      _121: (x0,x1) => x0.append(x1),
      _122: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _123: (x0,x1) => x0.querySelector(x1),
      _125: (x0,x1) => x0.removeChild(x1),
      _203: x0 => x0.stopPropagation(),
      _204: x0 => x0.preventDefault(),
      _206: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _251: x0 => x0.unlock(),
      _252: x0 => x0.getReader(),
      _253: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _254: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _255: (x0,x1) => x0.item(x1),
      _256: x0 => x0.next(),
      _257: x0 => x0.now(),
      _258: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._258(f,arguments.length,x0) }),
      _259: (x0,x1) => x0.addListener(x1),
      _260: (x0,x1) => x0.removeListener(x1),
      _261: (x0,x1) => x0.matchMedia(x1),
      _262: (x0,x1) => x0.revokeObjectURL(x1),
      _263: x0 => x0.close(),
      _264: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _265: x0 => new window.ImageDecoder(x0),
      _266: x0 => ({frameIndex: x0}),
      _267: (x0,x1) => x0.decode(x1),
      _268: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._268(f,arguments.length,x0) }),
      _269: (x0,x1) => x0.getModifierState(x1),
      _270: (x0,x1) => x0.removeProperty(x1),
      _271: (x0,x1) => x0.prepend(x1),
      _272: x0 => x0.disconnect(),
      _273: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._273(f,arguments.length,x0) }),
      _274: (x0,x1) => x0.getAttribute(x1),
      _275: (x0,x1) => x0.contains(x1),
      _276: x0 => x0.blur(),
      _277: x0 => x0.hasFocus(),
      _278: (x0,x1) => x0.hasAttribute(x1),
      _279: (x0,x1) => x0.getModifierState(x1),
      _280: (x0,x1) => x0.appendChild(x1),
      _281: (x0,x1) => x0.createTextNode(x1),
      _282: (x0,x1) => x0.removeAttribute(x1),
      _283: x0 => x0.getBoundingClientRect(),
      _284: (x0,x1) => x0.observe(x1),
      _285: x0 => x0.disconnect(),
      _286: (x0,x1) => x0.closest(x1),
      _696: () => globalThis.window.flutterConfiguration,
      _697: x0 => x0.assetBase,
      _703: x0 => x0.debugShowSemanticsNodes,
      _704: x0 => x0.hostElement,
      _705: x0 => x0.multiViewEnabled,
      _706: x0 => x0.nonce,
      _708: x0 => x0.fontFallbackBaseUrl,
      _712: x0 => x0.console,
      _713: x0 => x0.devicePixelRatio,
      _714: x0 => x0.document,
      _715: x0 => x0.history,
      _716: x0 => x0.innerHeight,
      _717: x0 => x0.innerWidth,
      _718: x0 => x0.location,
      _719: x0 => x0.navigator,
      _720: x0 => x0.visualViewport,
      _721: x0 => x0.performance,
      _723: x0 => x0.URL,
      _725: (x0,x1) => x0.getComputedStyle(x1),
      _726: x0 => x0.screen,
      _727: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._727(f,arguments.length,x0) }),
      _728: (x0,x1) => x0.requestAnimationFrame(x1),
      _733: (x0,x1) => x0.warn(x1),
      _735: (x0,x1) => x0.debug(x1),
      _736: x0 => globalThis.parseFloat(x0),
      _737: () => globalThis.window,
      _738: () => globalThis.Intl,
      _739: () => globalThis.Symbol,
      _740: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _742: x0 => x0.clipboard,
      _743: x0 => x0.maxTouchPoints,
      _744: x0 => x0.vendor,
      _745: x0 => x0.language,
      _746: x0 => x0.platform,
      _747: x0 => x0.userAgent,
      _748: (x0,x1) => x0.vibrate(x1),
      _749: x0 => x0.languages,
      _750: x0 => x0.documentElement,
      _751: (x0,x1) => x0.querySelector(x1),
      _754: (x0,x1) => x0.createElement(x1),
      _757: (x0,x1) => x0.createEvent(x1),
      _758: x0 => x0.activeElement,
      _761: x0 => x0.head,
      _762: x0 => x0.body,
      _764: (x0,x1) => { x0.title = x1 },
      _767: x0 => x0.visibilityState,
      _768: () => globalThis.document,
      _769: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._769(f,arguments.length,x0) }),
      _770: (x0,x1) => x0.dispatchEvent(x1),
      _778: x0 => x0.target,
      _780: x0 => x0.timeStamp,
      _781: x0 => x0.type,
      _783: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _790: x0 => x0.firstChild,
      _794: x0 => x0.parentElement,
      _796: (x0,x1) => { x0.textContent = x1 },
      _797: x0 => x0.parentNode,
      _799: x0 => x0.isConnected,
      _803: x0 => x0.firstElementChild,
      _805: x0 => x0.nextElementSibling,
      _806: x0 => x0.clientHeight,
      _807: x0 => x0.clientWidth,
      _808: x0 => x0.offsetHeight,
      _809: x0 => x0.offsetWidth,
      _810: x0 => x0.id,
      _811: (x0,x1) => { x0.id = x1 },
      _814: (x0,x1) => { x0.spellcheck = x1 },
      _815: x0 => x0.tagName,
      _816: x0 => x0.style,
      _818: (x0,x1) => x0.querySelectorAll(x1),
      _819: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _820: x0 => x0.tabIndex,
      _821: (x0,x1) => { x0.tabIndex = x1 },
      _822: (x0,x1) => x0.focus(x1),
      _823: x0 => x0.scrollTop,
      _824: (x0,x1) => { x0.scrollTop = x1 },
      _825: x0 => x0.scrollLeft,
      _826: (x0,x1) => { x0.scrollLeft = x1 },
      _827: x0 => x0.classList,
      _829: (x0,x1) => { x0.className = x1 },
      _831: (x0,x1) => x0.getElementsByClassName(x1),
      _832: (x0,x1) => x0.attachShadow(x1),
      _835: x0 => x0.computedStyleMap(),
      _836: (x0,x1) => x0.get(x1),
      _842: (x0,x1) => x0.getPropertyValue(x1),
      _843: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _844: x0 => x0.offsetLeft,
      _845: x0 => x0.offsetTop,
      _846: x0 => x0.offsetParent,
      _848: (x0,x1) => { x0.name = x1 },
      _849: x0 => x0.content,
      _850: (x0,x1) => { x0.content = x1 },
      _854: (x0,x1) => { x0.src = x1 },
      _855: x0 => x0.naturalWidth,
      _856: x0 => x0.naturalHeight,
      _860: (x0,x1) => { x0.crossOrigin = x1 },
      _862: (x0,x1) => { x0.decoding = x1 },
      _863: x0 => x0.decode(),
      _868: (x0,x1) => { x0.nonce = x1 },
      _873: (x0,x1) => { x0.width = x1 },
      _875: (x0,x1) => { x0.height = x1 },
      _878: (x0,x1) => x0.getContext(x1),
      _940: (x0,x1) => x0.fetch(x1),
      _941: x0 => x0.status,
      _943: x0 => x0.body,
      _944: x0 => x0.arrayBuffer(),
      _947: x0 => x0.read(),
      _948: x0 => x0.value,
      _949: x0 => x0.done,
      _951: x0 => x0.name,
      _952: x0 => x0.x,
      _953: x0 => x0.y,
      _956: x0 => x0.top,
      _957: x0 => x0.right,
      _958: x0 => x0.bottom,
      _959: x0 => x0.left,
      _971: x0 => x0.height,
      _972: x0 => x0.width,
      _973: x0 => x0.scale,
      _974: (x0,x1) => { x0.value = x1 },
      _977: (x0,x1) => { x0.placeholder = x1 },
      _979: (x0,x1) => { x0.name = x1 },
      _980: x0 => x0.selectionDirection,
      _981: x0 => x0.selectionStart,
      _982: x0 => x0.selectionEnd,
      _985: x0 => x0.value,
      _987: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _988: x0 => x0.readText(),
      _989: (x0,x1) => x0.writeText(x1),
      _991: x0 => x0.altKey,
      _992: x0 => x0.code,
      _993: x0 => x0.ctrlKey,
      _994: x0 => x0.key,
      _995: x0 => x0.keyCode,
      _996: x0 => x0.location,
      _997: x0 => x0.metaKey,
      _998: x0 => x0.repeat,
      _999: x0 => x0.shiftKey,
      _1000: x0 => x0.isComposing,
      _1002: x0 => x0.state,
      _1003: (x0,x1) => x0.go(x1),
      _1005: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1006: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1007: x0 => x0.pathname,
      _1008: x0 => x0.search,
      _1009: x0 => x0.hash,
      _1013: x0 => x0.state,
      _1016: (x0,x1) => x0.createObjectURL(x1),
      _1018: x0 => new Blob(x0),
      _1020: x0 => new MutationObserver(x0),
      _1021: (x0,x1,x2) => x0.observe(x1,x2),
      _1022: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1022(f,arguments.length,x0,x1) }),
      _1025: x0 => x0.attributeName,
      _1026: x0 => x0.type,
      _1027: x0 => x0.matches,
      _1028: x0 => x0.matches,
      _1032: x0 => x0.relatedTarget,
      _1034: x0 => x0.clientX,
      _1035: x0 => x0.clientY,
      _1036: x0 => x0.offsetX,
      _1037: x0 => x0.offsetY,
      _1040: x0 => x0.button,
      _1041: x0 => x0.buttons,
      _1042: x0 => x0.ctrlKey,
      _1046: x0 => x0.pointerId,
      _1047: x0 => x0.pointerType,
      _1048: x0 => x0.pressure,
      _1049: x0 => x0.tiltX,
      _1050: x0 => x0.tiltY,
      _1051: x0 => x0.getCoalescedEvents(),
      _1054: x0 => x0.deltaX,
      _1055: x0 => x0.deltaY,
      _1056: x0 => x0.wheelDeltaX,
      _1057: x0 => x0.wheelDeltaY,
      _1058: x0 => x0.deltaMode,
      _1065: x0 => x0.changedTouches,
      _1068: x0 => x0.clientX,
      _1069: x0 => x0.clientY,
      _1072: x0 => x0.data,
      _1075: (x0,x1) => { x0.disabled = x1 },
      _1077: (x0,x1) => { x0.type = x1 },
      _1078: (x0,x1) => { x0.max = x1 },
      _1079: (x0,x1) => { x0.min = x1 },
      _1080: x0 => x0.value,
      _1081: (x0,x1) => { x0.value = x1 },
      _1082: x0 => x0.disabled,
      _1083: (x0,x1) => { x0.disabled = x1 },
      _1085: (x0,x1) => { x0.placeholder = x1 },
      _1087: (x0,x1) => { x0.name = x1 },
      _1089: (x0,x1) => { x0.autocomplete = x1 },
      _1090: x0 => x0.selectionDirection,
      _1092: x0 => x0.selectionStart,
      _1093: x0 => x0.selectionEnd,
      _1096: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1097: (x0,x1) => x0.add(x1),
      _1100: (x0,x1) => { x0.noValidate = x1 },
      _1101: (x0,x1) => { x0.method = x1 },
      _1102: (x0,x1) => { x0.action = x1 },
      _1128: x0 => x0.orientation,
      _1129: x0 => x0.width,
      _1130: x0 => x0.height,
      _1131: (x0,x1) => x0.lock(x1),
      _1150: x0 => new ResizeObserver(x0),
      _1153: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1153(f,arguments.length,x0,x1) }),
      _1161: x0 => x0.length,
      _1162: x0 => x0.iterator,
      _1163: x0 => x0.Segmenter,
      _1164: x0 => x0.v8BreakIterator,
      _1165: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1166: x0 => x0.done,
      _1167: x0 => x0.value,
      _1168: x0 => x0.index,
      _1172: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1173: (x0,x1) => x0.adoptText(x1),
      _1174: x0 => x0.first(),
      _1175: x0 => x0.next(),
      _1176: x0 => x0.current(),
      _1182: x0 => x0.hostElement,
      _1183: x0 => x0.viewConstraints,
      _1186: x0 => x0.maxHeight,
      _1187: x0 => x0.maxWidth,
      _1188: x0 => x0.minHeight,
      _1189: x0 => x0.minWidth,
      _1190: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1190(f,arguments.length,x0) }),
      _1191: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1191(f,arguments.length,x0) }),
      _1192: (x0,x1) => ({addView: x0,removeView: x1}),
      _1193: x0 => x0.loader,
      _1194: () => globalThis._flutter,
      _1195: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1196: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1196(f,arguments.length,x0) }),
      _1197: f => finalizeWrapper(f, function() { return dartInstance.exports._1197(f,arguments.length) }),
      _1198: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1199: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1199(f,arguments.length,x0) }),
      _1200: x0 => ({runApp: x0}),
      _1201: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1201(f,arguments.length,x0,x1) }),
      _1202: x0 => x0.length,
      _1203: () => globalThis.window.ImageDecoder,
      _1204: x0 => x0.tracks,
      _1206: x0 => x0.completed,
      _1208: x0 => x0.image,
      _1214: x0 => x0.displayWidth,
      _1215: x0 => x0.displayHeight,
      _1216: x0 => x0.duration,
      _1219: x0 => x0.ready,
      _1220: x0 => x0.selectedTrack,
      _1221: x0 => x0.repetitionCount,
      _1222: x0 => x0.frameCount,
      _1266: x0 => x0.remove(),
      _1268: x0 => globalThis.URL.createObjectURL(x0),
      _1271: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1271(f,arguments.length,x0) }),
      _1272: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1272(f,arguments.length,x0) }),
      _1273: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1273(f,arguments.length,x0) }),
      _1274: (x0,x1) => x0.querySelector(x1),
      _1275: (x0,x1) => x0.createElement(x1),
      _1276: (x0,x1) => x0.append(x1),
      _1278: (x0,x1) => x0.replaceChildren(x1),
      _1279: x0 => x0.click(),
      _1285: (x0,x1) => x0.createElement(x1),
      _1291: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1292: () => new XMLHttpRequest(),
      _1293: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1294: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1295: (x0,x1) => x0.send(x1),
      _1296: x0 => x0.abort(),
      _1297: x0 => x0.getAllResponseHeaders(),
      _1303: x0 => x0.decode(),
      _1304: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1305: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1306: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1306(f,arguments.length,x0) }),
      _1307: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1307(f,arguments.length,x0) }),
      _1308: x0 => x0.send(),
      _1309: () => new XMLHttpRequest(),
      _1310: (x0,x1) => x0.removeItem(x1),
      _1312: (x0,x1) => x0.getItem(x1),
      _1313: (x0,x1,x2,x3,x4,x5,x6,x7) => x0.unwrapKey(x1,x2,x3,x4,x5,x6,x7),
      _1314: (x0,x1,x2,x3,x4,x5) => x0.importKey(x1,x2,x3,x4,x5),
      _1315: (x0,x1,x2,x3) => x0.generateKey(x1,x2,x3),
      _1316: (x0,x1,x2,x3,x4) => x0.wrapKey(x1,x2,x3,x4),
      _1317: (x0,x1,x2) => x0.exportKey(x1,x2),
      _1318: (x0,x1) => x0.getRandomValues(x1),
      _1319: (x0,x1,x2,x3) => x0.encrypt(x1,x2,x3),
      _1320: (x0,x1,x2,x3) => x0.decrypt(x1,x2,x3),
      _1321: Date.now,
      _1323: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1324: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1325: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1326: () => typeof dartUseDateNowForTicks !== "undefined",
      _1327: () => 1000 * performance.now(),
      _1328: () => Date.now(),
      _1329: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1330: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1331: () => new WeakMap(),
      _1332: (map, o) => map.get(o),
      _1333: (map, o, v) => map.set(o, v),
      _1334: x0 => new WeakRef(x0),
      _1335: x0 => x0.deref(),
      _1342: () => globalThis.WeakRef,
      _1346: s => JSON.stringify(s),
      _1347: s => printToConsole(s),
      _1348: (o, p, r) => o.replaceAll(p, () => r),
      _1349: (o, p, r) => o.replace(p, () => r),
      _1350: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1351: s => s.toUpperCase(),
      _1352: s => s.trim(),
      _1353: s => s.trimLeft(),
      _1354: s => s.trimRight(),
      _1355: (string, times) => string.repeat(times),
      _1356: Function.prototype.call.bind(String.prototype.indexOf),
      _1357: (s, p, i) => s.lastIndexOf(p, i),
      _1358: (string, token) => string.split(token),
      _1359: Object.is,
      _1360: o => o instanceof Array,
      _1361: (a, i) => a.push(i),
      _1362: (a, i) => a.splice(i, 1)[0],
      _1364: (a, l) => a.length = l,
      _1365: a => a.pop(),
      _1366: (a, i) => a.splice(i, 1),
      _1367: (a, s) => a.join(s),
      _1368: (a, s, e) => a.slice(s, e),
      _1370: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1371: a => a.length,
      _1372: (a, l) => a.length = l,
      _1373: (a, i) => a[i],
      _1374: (a, i, v) => a[i] = v,
      _1376: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1377: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1379: o => o instanceof Uint8Array,
      _1380: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1381: o => o instanceof Int8Array,
      _1382: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1383: o => o instanceof Uint8ClampedArray,
      _1384: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1385: o => o instanceof Uint16Array,
      _1386: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1387: o => o instanceof Int16Array,
      _1388: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1389: o => o instanceof Uint32Array,
      _1390: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1391: o => o instanceof Int32Array,
      _1392: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1394: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1395: o => o instanceof Float32Array,
      _1396: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1397: o => o instanceof Float64Array,
      _1398: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1399: (t, s) => t.set(s),
      _1400: l => new DataView(new ArrayBuffer(l)),
      _1401: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1403: o => o.buffer,
      _1404: o => o.byteOffset,
      _1405: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1406: (b, o) => new DataView(b, o),
      _1407: (b, o, l) => new DataView(b, o, l),
      _1408: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1409: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1410: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1411: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1412: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1413: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1414: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1415: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1416: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1417: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1418: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1419: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1422: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1423: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1424: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1425: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1426: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1427: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1440: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1441: (handle) => clearTimeout(handle),
      _1442: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1443: (handle) => clearInterval(handle),
      _1444: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1445: () => Date.now(),
      _1450: o => Object.keys(o),
      _1455: x0 => x0.continue(),
      _1462: (x0,x1) => x0.getAll(x1),
      _1464: (x0,x1) => x0.getAllKeys(x1),
      _1484: (x0,x1) => x0.get(x1),
      _1485: x0 => x0.clear(),
      _1487: (x0,x1,x2) => x0.put(x1,x2),
      _1488: (x0,x1) => x0.delete(x1),
      _1490: x0 => x0.openCursor(),
      _1497: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1497(f,arguments.length,x0) }),
      _1498: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1498(f,arguments.length,x0) }),
      _1499: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1499(f,arguments.length,x0) }),
      _1500: (x0,x1) => x0.objectStore(x1),
      _1502: (x0,x1) => ({keyPath: x0,autoIncrement: x1}),
      _1503: (x0,x1,x2) => x0.createObjectStore(x1,x2),
      _1504: (x0,x1,x2) => x0.transaction(x1,x2),
      _1505: x0 => x0.close(),
      _1506: (x0,x1) => x0.deleteObjectStore(x1),
      _1508: (x0,x1,x2) => x0.open(x1,x2),
      _1511: (x0,x1) => x0.deleteDatabase(x1),
      _1523: (x0,x1) => x0.item(x1),
      _1524: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1524(f,arguments.length,x0) }),
      _1525: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1525(f,arguments.length,x0) }),
      _1536: (x0,x1) => x0.contains(x1),
      _1537: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1537(f,arguments.length,x0) }),
      _1538: (x0,x1) => x0.createObjectStore(x1),
      _1539: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1539(f,arguments.length,x0) }),
      _1540: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1540(f,arguments.length,x0) }),
      _1547: (x0,x1,x2) => x0.open(x1,x2),
      _1548: x0 => x0.send(),
      _1553: () => new FileReader(),
      _1554: (x0,x1) => x0.readAsArrayBuffer(x1),
      _1557: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1557(f,arguments.length,x0) }),
      _1558: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1558(f,arguments.length,x0) }),
      _1559: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1559(f,arguments.length,x0) }),
      _1560: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1560(f,arguments.length,x0) }),
      _1563: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1563(f,arguments.length,x0) }),
      _1564: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1564(f,arguments.length,x0) }),
      _1565: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1566: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1573: (x0,x1) => x0.item(x1),
      _1582: (x0,x1,x2) => x0.setItem(x1,x2),
      _1583: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _1584: (x0,x1) => x0.exec(x1),
      _1585: (x0,x1) => x0.test(x1),
      _1586: x0 => x0.pop(),
      _1588: o => o === undefined,
      _1590: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _1592: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _1593: o => o instanceof RegExp,
      _1594: (l, r) => l === r,
      _1595: o => o,
      _1596: o => o,
      _1597: o => o,
      _1598: b => !!b,
      _1599: o => o.length,
      _1601: (o, i) => o[i],
      _1602: f => f.dartFunction,
      _1603: () => ({}),
      _1604: () => [],
      _1606: () => globalThis,
      _1607: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _1608: (o, p) => p in o,
      _1609: (o, p) => o[p],
      _1610: (o, p, v) => o[p] = v,
      _1611: (o, m, a) => o[m].apply(o, a),
      _1613: o => String(o),
      _1614: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _1615: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        return 18;
      },
      _1616: o => [o],
      _1617: (o0, o1) => [o0, o1],
      _1618: (o0, o1, o2) => [o0, o1, o2],
      _1619: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _1620: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1621: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1622: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1623: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1624: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1625: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1626: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1627: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1628: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1629: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1630: x0 => new ArrayBuffer(x0),
      _1631: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _1633: x0 => x0.index,
      _1634: x0 => x0.groups,
      _1635: x0 => x0.flags,
      _1636: x0 => x0.multiline,
      _1637: x0 => x0.ignoreCase,
      _1638: x0 => x0.unicode,
      _1639: x0 => x0.dotAll,
      _1640: (x0,x1) => { x0.lastIndex = x1 },
      _1641: (o, p) => p in o,
      _1642: (o, p) => o[p],
      _1643: (o, p, v) => o[p] = v,
      _1645: x0 => globalThis.Object.keys(x0),
      _1646: x0 => new Date(x0),
      _1648: x0 => x0.getTime(),
      _1649: x0 => x0.length,
      _1650: x0 => x0.message,
      _1651: x0 => x0.name,
      _1652: x0 => x0.random(),
      _1653: (x0,x1) => x0.getRandomValues(x1),
      _1654: () => globalThis.crypto,
      _1655: () => globalThis.Math,
      _1656: Function.prototype.call.bind(Number.prototype.toString),
      _1657: Function.prototype.call.bind(BigInt.prototype.toString),
      _1658: Function.prototype.call.bind(Number.prototype.toString),
      _1659: (d, digits) => d.toFixed(digits),
      _1667: () => globalThis.document,
      _1673: (x0,x1) => { x0.height = x1 },
      _1675: (x0,x1) => { x0.width = x1 },
      _1684: x0 => x0.style,
      _1687: x0 => x0.src,
      _1688: (x0,x1) => { x0.src = x1 },
      _1689: x0 => x0.naturalWidth,
      _1690: x0 => x0.naturalHeight,
      _1706: x0 => x0.status,
      _1707: (x0,x1) => { x0.responseType = x1 },
      _1709: x0 => x0.response,
      _1747: x0 => x0.readyState,
      _1749: (x0,x1) => { x0.timeout = x1 },
      _1751: (x0,x1) => { x0.withCredentials = x1 },
      _1752: x0 => x0.upload,
      _1753: x0 => x0.responseURL,
      _1754: x0 => x0.status,
      _1755: x0 => x0.statusText,
      _1757: (x0,x1) => { x0.responseType = x1 },
      _1758: x0 => x0.response,
      _1770: x0 => x0.loaded,
      _1771: x0 => x0.total,
      _1793: x0 => x0.length,
      _1845: (x0,x1) => { x0.oncancel = x1 },
      _1851: (x0,x1) => { x0.onchange = x1 },
      _1891: (x0,x1) => { x0.onerror = x1 },
      _2761: (x0,x1) => { x0.accept = x1 },
      _2775: x0 => x0.files,
      _2801: (x0,x1) => { x0.multiple = x1 },
      _2819: (x0,x1) => { x0.type = x1 },
      _3537: () => globalThis.window,
      _3577: x0 => x0.self,
      _3600: x0 => x0.navigator,
      _3857: x0 => x0.indexedDB,
      _3858: x0 => x0.crypto,
      _3863: x0 => x0.sessionStorage,
      _3864: x0 => x0.localStorage,
      _3976: x0 => x0.maxTouchPoints,
      _3986: x0 => x0.platform,
      _3990: x0 => x0.vendor,
      _6099: x0 => x0.type,
      _6100: x0 => x0.target,
      _6212: () => globalThis.document,
      _6294: x0 => x0.body,
      _6628: (x0,x1) => { x0.id = x1 },
      _8156: x0 => x0.size,
      _8157: x0 => x0.type,
      _8164: x0 => x0.name,
      _8165: x0 => x0.lastModified,
      _8170: x0 => x0.length,
      _8176: x0 => x0.result,
      _10135: x0 => x0.result,
      _10136: x0 => x0.error,
      _10141: (x0,x1) => { x0.onsuccess = x1 },
      _10143: (x0,x1) => { x0.onerror = x1 },
      _10147: (x0,x1) => { x0.onupgradeneeded = x1 },
      _10163: x0 => x0.name,
      _10164: x0 => x0.version,
      _10165: x0 => x0.objectStoreNames,
      _10182: x0 => x0.name,
      _10184: x0 => x0.keyPath,
      _10187: x0 => x0.autoIncrement,
      _10207: x0 => x0.key,
      _10210: x0 => x0.value,
      _10216: x0 => x0.error,
      _10218: (x0,x1) => { x0.onabort = x1 },
      _10220: (x0,x1) => { x0.oncomplete = x1 },
      _10222: (x0,x1) => { x0.onerror = x1 },
      _12270: x0 => x0.name,
      _12271: x0 => x0.message,
      _12274: x0 => x0.subtle,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      s: [
        "([ \r\n\t]+)|([!-\\[\\]-‧‪-퟿豈-￿][̀-ͯ]*|[\ud800-\udbff][\udc00-\udfff][̀-ͯ]*|\\\\verb\\*([^]).*?\\3|\\\\verb([^*a-zA-Z]).*?\\4|\\\\operatorname\\*|\\\\[a-zA-Z@]+[ \r\n\t]*|\\\\[^\ud800-\udfff])",
      ],
      S: new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
