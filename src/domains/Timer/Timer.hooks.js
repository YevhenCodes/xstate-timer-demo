import { useMemo } from "react";
import { formatMilliseconds, getControlButtonsList } from "./Timer.utils";

export const useConrolsList = (state) => {
	return useMemo(() => {
		return getControlButtonsList(state);
	}, [state]);
};

export const useFormattedMilliseconds = (value) => {
	return useMemo(() => {
		return formatMilliseconds(value);
	}, [value]);
};
