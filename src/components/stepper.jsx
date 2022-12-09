import React from 'react';

import { ViewGridAddIcon, SwitchHorizontalIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import Contents from './content-stepper';
import '../assets/styles/custom.css';

export default function ProgressStepBar(props) {
  const { dataGet } = props;

  const { activeStep, setStep } = useSteps({
    initialStep: 0,
  });
  return (
    <Steps orientation="vertical" activeStep={activeStep} col onClickStep={step => setStep(step)} fontSize="24px">
      {dataGet?.journey?.map(({ status, request_number, warehouse, storage }, index) => (
        <Step
          width="100%"
          fontSize="20px"
          label={status}
          description={dataGet.product_desc}
          isCompletedStep={false}
          icon={
            status === 'INBOUND' ? ViewGridAddIcon : status === 'OUTBOUND' ? ShoppingCartIcon : SwitchHorizontalIcon
          }
          key={status}
          position="relative"
        >
          <div className="absolute -right-28 top-2 text-gray-400">
            <p>{request_number}</p>
          </div>
          <Contents dataWarehouse={warehouse} dataStorage={storage} my={1} index={index} />
        </Step>
      ))}
    </Steps>
  );
}
