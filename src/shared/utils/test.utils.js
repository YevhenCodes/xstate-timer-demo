export const getPathDescription = (path) => {
	return path.steps
		.map((step) => {
			if (step.event.type === "xstate.init") {
				return "init";
			}
			return step.event.type;
		})
		.join(", ");
};

export function addMetaToStates(config, meta) {
	const statesWithMeta = Object.keys(config.states).reduce(
		(states, stateKey) => {
			states[stateKey] = {
				...config.states[stateKey],
				meta: {
					...(config.states[stateKey].meta || {}),
					...meta[stateKey],
				},
			};
			return states;
		},
		{},
	);

	return {
		...config,
		states: statesWithMeta,
	};
}
