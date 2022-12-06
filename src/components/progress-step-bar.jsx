import React from 'react';

import Moment from 'moment';
import { ViewGridAddIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import Contents from './Content';
import '../assets/styles/custom.css';

const steps = [
  { label: 'Inbound', description: '25 JUL 2022', icon: ViewGridAddIcon },
  { label: 'Relocate - Out', description: '25 JUL 2022', icon: SwitchHorizontalIcon },
];

export default function ProgressStepBar(props) {
  const { dataGet } = props;

  const { prevStep, nextStep, activeStep } = useSteps({
    initialStep: 0,
  });
  return (
    <>
      <Steps
        orientation="vertical"
        activeStep={activeStep}
        checkIcon={ViewGridAddIcon}
        onClick={activeStep === 0 ? nextStep : prevStep}
      >
        {steps.map(({ label, icon }, index) => (
          <Step
            width="100%"
            label={label}
            description={Moment(dataGet.activity_date).format('DD MMM YYYY')}
            icon={icon}
            key={label}
          >
            <Contents dataGetJourney={dataGet} my={1} index={index} />
          </Step>
        ))}
      </Steps>
    </>
  );
}
