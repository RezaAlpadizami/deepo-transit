import React, { useRef, useEffect, forwardRef } from 'react';

const Checkbox = forwardRef(({ disable = false, indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return <input type="checkbox" className="mr-2" ref={resolvedRef} {...rest} disabled={disable} />;
});
export default Checkbox;
