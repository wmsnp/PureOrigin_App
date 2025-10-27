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
      _1310: Date.now,
      _1312: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1313: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1314: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1315: () => typeof dartUseDateNowForTicks !== "undefined",
      _1316: () => 1000 * performance.now(),
      _1317: () => Date.now(),
      _1318: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1319: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1320: () => new WeakMap(),
      _1321: (map, o) => map.get(o),
      _1322: (map, o, v) => map.set(o, v),
      _1323: x0 => new WeakRef(x0),
      _1324: x0 => x0.deref(),
      _1331: () => globalThis.WeakRef,
      _1335: s => JSON.stringify(s),
      _1336: s => printToConsole(s),
      _1337: (o, p, r) => o.replaceAll(p, () => r),
      _1338: (o, p, r) => o.replace(p, () => r),
      _1339: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1340: s => s.toUpperCase(),
      _1341: s => s.trim(),
      _1342: s => s.trimLeft(),
      _1343: s => s.trimRight(),
      _1344: (string, times) => string.repeat(times),
      _1345: Function.prototype.call.bind(String.prototype.indexOf),
      _1346: (s, p, i) => s.lastIndexOf(p, i),
      _1347: (string, token) => string.split(token),
      _1348: Object.is,
      _1349: o => o instanceof Array,
      _1350: (a, i) => a.push(i),
      _1351: (a, i) => a.splice(i, 1)[0],
      _1353: (a, l) => a.length = l,
      _1354: a => a.pop(),
      _1355: (a, i) => a.splice(i, 1),
      _1356: (a, s) => a.join(s),
      _1357: (a, s, e) => a.slice(s, e),
      _1359: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1360: a => a.length,
      _1361: (a, l) => a.length = l,
      _1362: (a, i) => a[i],
      _1363: (a, i, v) => a[i] = v,
      _1365: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1366: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1368: o => o instanceof Uint8Array,
      _1369: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1370: o => o instanceof Int8Array,
      _1371: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1372: o => o instanceof Uint8ClampedArray,
      _1373: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1374: o => o instanceof Uint16Array,
      _1375: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1376: o => o instanceof Int16Array,
      _1377: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1378: o => o instanceof Uint32Array,
      _1379: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1380: o => o instanceof Int32Array,
      _1381: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1383: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1384: o => o instanceof Float32Array,
      _1385: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1386: o => o instanceof Float64Array,
      _1387: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1388: (t, s) => t.set(s),
      _1389: l => new DataView(new ArrayBuffer(l)),
      _1390: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1392: o => o.buffer,
      _1393: o => o.byteOffset,
      _1394: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1395: (b, o) => new DataView(b, o),
      _1396: (b, o, l) => new DataView(b, o, l),
      _1397: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1398: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1399: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1400: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1401: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1402: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1403: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1404: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1405: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1406: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1407: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1408: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1411: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1412: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1413: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1414: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1415: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1416: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1429: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1430: (handle) => clearTimeout(handle),
      _1431: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1432: (handle) => clearInterval(handle),
      _1433: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1434: () => Date.now(),
      _1439: o => Object.keys(o),
      _1444: x0 => x0.continue(),
      _1451: (x0,x1) => x0.getAll(x1),
      _1453: (x0,x1) => x0.getAllKeys(x1),
      _1473: (x0,x1) => x0.get(x1),
      _1474: x0 => x0.clear(),
      _1476: (x0,x1,x2) => x0.put(x1,x2),
      _1477: (x0,x1) => x0.delete(x1),
      _1479: x0 => x0.openCursor(),
      _1486: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1486(f,arguments.length,x0) }),
      _1487: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1487(f,arguments.length,x0) }),
      _1488: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1488(f,arguments.length,x0) }),
      _1489: (x0,x1) => x0.objectStore(x1),
      _1491: (x0,x1) => ({keyPath: x0,autoIncrement: x1}),
      _1492: (x0,x1,x2) => x0.createObjectStore(x1,x2),
      _1493: (x0,x1,x2) => x0.transaction(x1,x2),
      _1494: x0 => x0.close(),
      _1495: (x0,x1) => x0.deleteObjectStore(x1),
      _1497: (x0,x1,x2) => x0.open(x1,x2),
      _1500: (x0,x1) => x0.deleteDatabase(x1),
      _1512: (x0,x1) => x0.item(x1),
      _1513: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1513(f,arguments.length,x0) }),
      _1514: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1514(f,arguments.length,x0) }),
      _1525: (x0,x1) => x0.contains(x1),
      _1526: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1526(f,arguments.length,x0) }),
      _1527: (x0,x1) => x0.createObjectStore(x1),
      _1528: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1528(f,arguments.length,x0) }),
      _1529: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1529(f,arguments.length,x0) }),
      _1536: (x0,x1,x2) => x0.open(x1,x2),
      _1537: x0 => x0.send(),
      _1542: () => new FileReader(),
      _1543: (x0,x1) => x0.readAsArrayBuffer(x1),
      _1546: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1546(f,arguments.length,x0) }),
      _1547: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1547(f,arguments.length,x0) }),
      _1548: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1548(f,arguments.length,x0) }),
      _1549: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1549(f,arguments.length,x0) }),
      _1552: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1552(f,arguments.length,x0) }),
      _1553: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1553(f,arguments.length,x0) }),
      _1554: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1555: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1562: (x0,x1) => x0.item(x1),
      _1573: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _1574: (x0,x1) => x0.exec(x1),
      _1575: (x0,x1) => x0.test(x1),
      _1576: x0 => x0.pop(),
      _1578: o => o === undefined,
      _1580: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _1582: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _1583: o => o instanceof RegExp,
      _1584: (l, r) => l === r,
      _1585: o => o,
      _1586: o => o,
      _1587: o => o,
      _1588: b => !!b,
      _1589: o => o.length,
      _1591: (o, i) => o[i],
      _1592: f => f.dartFunction,
      _1593: () => ({}),
      _1594: () => [],
      _1596: () => globalThis,
      _1597: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _1598: (o, p) => p in o,
      _1599: (o, p) => o[p],
      _1600: (o, p, v) => o[p] = v,
      _1601: (o, m, a) => o[m].apply(o, a),
      _1603: o => String(o),
      _1604: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _1605: o => {
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
      _1606: o => [o],
      _1607: (o0, o1) => [o0, o1],
      _1608: (o0, o1, o2) => [o0, o1, o2],
      _1609: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _1610: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1611: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1612: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1613: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1614: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1615: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1616: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1617: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1618: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1619: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1620: x0 => new ArrayBuffer(x0),
      _1621: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _1623: x0 => x0.index,
      _1624: x0 => x0.groups,
      _1625: x0 => x0.flags,
      _1626: x0 => x0.multiline,
      _1627: x0 => x0.ignoreCase,
      _1628: x0 => x0.unicode,
      _1629: x0 => x0.dotAll,
      _1630: (x0,x1) => { x0.lastIndex = x1 },
      _1631: (o, p) => p in o,
      _1632: (o, p) => o[p],
      _1633: (o, p, v) => o[p] = v,
      _1635: x0 => globalThis.Object.keys(x0),
      _1636: x0 => new Date(x0),
      _1638: x0 => x0.getTime(),
      _1639: x0 => x0.length,
      _1640: x0 => x0.message,
      _1641: x0 => x0.name,
      _1642: x0 => x0.random(),
      _1643: (x0,x1) => x0.getRandomValues(x1),
      _1644: () => globalThis.crypto,
      _1645: () => globalThis.Math,
      _1646: Function.prototype.call.bind(Number.prototype.toString),
      _1647: Function.prototype.call.bind(BigInt.prototype.toString),
      _1648: Function.prototype.call.bind(Number.prototype.toString),
      _1649: (d, digits) => d.toFixed(digits),
      _1657: () => globalThis.document,
      _1663: (x0,x1) => { x0.height = x1 },
      _1665: (x0,x1) => { x0.width = x1 },
      _1674: x0 => x0.style,
      _1677: x0 => x0.src,
      _1678: (x0,x1) => { x0.src = x1 },
      _1679: x0 => x0.naturalWidth,
      _1680: x0 => x0.naturalHeight,
      _1696: x0 => x0.status,
      _1697: (x0,x1) => { x0.responseType = x1 },
      _1699: x0 => x0.response,
      _1741: x0 => x0.readyState,
      _1743: (x0,x1) => { x0.timeout = x1 },
      _1745: (x0,x1) => { x0.withCredentials = x1 },
      _1746: x0 => x0.upload,
      _1747: x0 => x0.responseURL,
      _1748: x0 => x0.status,
      _1749: x0 => x0.statusText,
      _1751: (x0,x1) => { x0.responseType = x1 },
      _1752: x0 => x0.response,
      _1764: x0 => x0.loaded,
      _1765: x0 => x0.total,
      _1787: x0 => x0.length,
      _1839: (x0,x1) => { x0.oncancel = x1 },
      _1845: (x0,x1) => { x0.onchange = x1 },
      _1885: (x0,x1) => { x0.onerror = x1 },
      _2755: (x0,x1) => { x0.accept = x1 },
      _2769: x0 => x0.files,
      _2795: (x0,x1) => { x0.multiple = x1 },
      _2813: (x0,x1) => { x0.type = x1 },
      _3531: () => globalThis.window,
      _3571: x0 => x0.self,
      _3594: x0 => x0.navigator,
      _3851: x0 => x0.indexedDB,
      _3970: x0 => x0.maxTouchPoints,
      _3980: x0 => x0.platform,
      _3984: x0 => x0.vendor,
      _6095: x0 => x0.type,
      _6096: x0 => x0.target,
      _6208: () => globalThis.document,
      _6290: x0 => x0.body,
      _6624: (x0,x1) => { x0.id = x1 },
      _8152: x0 => x0.size,
      _8153: x0 => x0.type,
      _8160: x0 => x0.name,
      _8161: x0 => x0.lastModified,
      _8166: x0 => x0.length,
      _8172: x0 => x0.result,
      _10131: x0 => x0.result,
      _10132: x0 => x0.error,
      _10137: (x0,x1) => { x0.onsuccess = x1 },
      _10139: (x0,x1) => { x0.onerror = x1 },
      _10143: (x0,x1) => { x0.onupgradeneeded = x1 },
      _10159: x0 => x0.name,
      _10160: x0 => x0.version,
      _10161: x0 => x0.objectStoreNames,
      _10178: x0 => x0.name,
      _10180: x0 => x0.keyPath,
      _10183: x0 => x0.autoIncrement,
      _10203: x0 => x0.key,
      _10206: x0 => x0.value,
      _10212: x0 => x0.error,
      _10214: (x0,x1) => { x0.onabort = x1 },
      _10216: (x0,x1) => { x0.oncomplete = x1 },
      _10218: (x0,x1) => { x0.onerror = x1 },
      _12266: x0 => x0.name,
      _12267: x0 => x0.message,

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
