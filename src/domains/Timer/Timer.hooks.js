import { useMemo } from "react";
import { getControlButtonsList, formatMilliseconds } from './Timer.utils';

export const useConrolsList = (state) => {
    return useMemo(() => {
        return getControlButtonsList(state)
    }, [state])
}

export const useFormattedMilliseconds = (value) => {
    return useMemo(() => {
        return formatMilliseconds(value);
    }, [value]);
}