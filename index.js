import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { TextDecoder } from "text-encoding";

const setupPolyfills = async () => {
  const { polyfillGlobal } = await import(
    "react-native/Libraries/Utilities/PolyfillFunctions"
  );
  const { ReadableStream, TransformStream } = await import(
    "web-streams-polyfill/dist/ponyfill"
  );
  const { TextEncoderStream, TextDecoderStream } = await import(
    "@stardazed/streams-text-encoding"
  );
  const { fetch, Headers, Request, Response } = await import(
    "react-native-fetch-api"
  );

  polyfillGlobal("TextDecoder", () => TextDecoder);
  polyfillGlobal("ReadableStream", () => ReadableStream);
  polyfillGlobal("TransformStream", () => TransformStream);
  polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
  polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  polyfillGlobal(
    "fetch",
    () =>
      (...args) =>
        fetch(args[0], { ...args[1], reactNative: { textStreaming: true } })
  );
  polyfillGlobal("Headers", () => Headers);
  polyfillGlobal("Request", () => Request);
  polyfillGlobal("Response", () => Response);
};

setupPolyfills();
AppRegistry.registerComponent(appName, () => App);

// // Globally define the reactNative property in RequestInit
// // No need for interface declaration in JavaScript
// global.RequestInit = {
//   ...global.RequestInit, // Preserve existing properties if any
//   reactNative: {
//     textStreaming: true,
//   },
// };