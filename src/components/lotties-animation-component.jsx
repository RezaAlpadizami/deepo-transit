import React from 'react';
import Lottie from 'react-lottie';

function LottiesAnimation(props) {
  const { animationsData, classCustom, visible = false } = props;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationsData,
    renderer: 'svg',
  };
  return visible ? (
    <div
      // className={`absolute ${isLarge ? 'right-7 left-[52%]' : 'right-8 left-8'} top-${top || '0'} left-${
      //   left || '0'
      // } bg-white z-[999] flex flex-col items-center justify-center`}
      className={classCustom}
    >
      <Lottie options={defaultOptions} width={400} height={200} />
    </div>
  ) : null;
}

export default LottiesAnimation;
