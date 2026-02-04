// Removed invalid Sentry/Wix Navigation setup
// Sentry should be initialized in app/_layout.tsx or a dedicated config file



if (__DEV__) {
  require("./ReactotronConfig");
}

import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

const errorHandler = (error: any, isFatal?: boolean) => {
  // TODO: send error to your server
  console.log(error, isFatal);
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString: string) => {
  // TODO: send error to your server
  console.log(errorString);
});


import 'react-native-reanimated';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import 'expo-router/entry';
