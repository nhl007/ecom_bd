import { useEffect, useState } from "react";

const useAlertState = <T>(
  defaultState: T | null
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] => {
  const [state, setState] = useState<T | null>(defaultState);

  useEffect(() => {
    setTimeout(() => {
      setState(null);
    }, 3000);
  }, [state]);

  return [state, setState];
};

export default useAlertState;
