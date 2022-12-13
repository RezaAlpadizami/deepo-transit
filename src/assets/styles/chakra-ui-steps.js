import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

import { mode } from '@chakra-ui/theme-tools';

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
  fontSize: 'xs',
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
      bg: 'white',
      borderColor: 'blue.500',
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
export default CustomSteps;
