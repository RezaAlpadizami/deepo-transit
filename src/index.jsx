/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

import { mode } from '@chakra-ui/theme-tools';

import './index.css';
import './assets/styles/custom.css';
import Context from './context';
import RootStore from './store/root-store';
import reportWebVitals from './reportWebVitals';

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
const baseStyleLabel = props => {
  return {
    color: mode(`gray.900`, `gray.100`)(props),
    fontWeight: 'medium',
    textAlign: 'center',
    marginLeft: '15px',
    fontSize: 'lg',
  };
};
const baseStyleDescription = props => ({
  color: mode(`gray.500`, `gray.200`)(props),
  marginTop: '2px',
  fontWeight: 'medium',
  marginLeft: '15px',
  fontSize: 'xs',
  wordSpacing: '50px',
});

const baseStyleStepIconContainer = props => {
  const { colorScheme: c } = props;
  const activeColor = `${c}.500`;

  return {
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'white',
    borderColor: '#5081ED',
    transitionProperty: 'background, border-color',
    transitionDuration: 'normal',
    _activeStep: {
      bg: 'gray.100',
      borderColor: 'green.500',
      _invalid: {
        bg: 'red.500',
        borderColor: 'red.500',
      },
    },
    _highlighted: {
      bg: activeColor,
      borderColor: activeColor,
    },
    '&[data-clickable]:hover': {
      borderColor: activeColor,
    },
  };
};

const CustomSteps = {
  ...Steps,
  baseStyle: props => {
    return {
      ...Steps.baseStyle(props),
      label: baseStyleLabel(props),
      description: baseStyleDescription(props),
      stepIconContainer: baseStyleStepIconContainer(props),
      icon: {
        ...Steps.baseStyle(props).icon,
        colors: 'red.900',
        strokeWidth: '10px',
      },
    };
  },
};
const components = {
  Steps: CustomSteps,
};

const theme = extendTheme({ colors, components });

const store = RootStore.create({ isLogin: false });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Context.Provider value={{ store }}>
        <App />
      </Context.Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
