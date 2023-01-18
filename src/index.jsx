/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import CustomSteps from './assets/styles/chakra-ui-steps';
import './index.css';
import './assets/styles/custom.css';
import Context from './context';
import RootStore from './store/root-store';
import reportWebVitals from './reportWebVitals';
import BoundActivity from './store/bound-activity-store';

const App = React.lazy(() => import('./navigation/main'));

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  primary: {
    500: '#246ee5',
  },
};

const components = {
  Steps: CustomSteps,
};

const theme = extendTheme({ colors, components });

const store = RootStore.create({ isLogin: false });
const activityStore = BoundActivity.create();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Context.Provider value={{ store, activityStore }}>
        <App />
      </Context.Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
