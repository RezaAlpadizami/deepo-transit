import React from 'react';

import Moment from 'moment';
import { ViewGridAddIcon, SwitchHorizontalIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import Contents from './Content';
import '../assets/styles/custom.css';

const steps = [
  { label: 'Inbound', icon: ViewGridAddIcon, requestId: '0001/JUL/2022' },
  { label: 'Relocate - Out', icon: SwitchHorizontalIcon, requestId: '0001/AUG/2022' },
  { label: 'Relocate - In', icon: SwitchHorizontalIcon, requestId: '0001/MAR/2022' },
  { label: 'Outbound', icon: ShoppingCartIcon, requestId: '0001/MAR/2022' },
];

export default function ProgressStepBar(props) {
  const { dataGet } = props;

  const { activeStep, setStep } = useSteps({
    initialStep: 0,
  });
  return (
    <Steps orientation="vertical" activeStep={activeStep} col onClickStep={step => setStep(step)} fontSize="24px">
      {steps.map(({ label, icon, requestId }, index) => (
        <Step
          width="100%"
          fontSize="20px"
          label={label}
          description={Moment(dataGet.activity_date).format('DD MMM YYYY')}
          isCompletedStep={false}
          icon={icon}
          key={label}
          position="relative"
        >
          <div className="absolute -right-56 top-2 text-gray-400">
            <p>{requestId}</p>
          </div>
          <Contents dataGetJourney={dataGet} my={1} index={index} />
        </Step>
      ))}
    </Steps>
  );
}
