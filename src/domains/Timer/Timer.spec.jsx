import { expect, it, vi, beforeEach, afterEach } from "vitest";
import { getSimplePaths } from "@xstate/graph";
import { createMachine } from "xstate";
import { render, act, fireEvent } from "@testing-library/react";
import { describe } from "vitest";

import Timer from "./Timer";
import { TimerMachine } from "./Timer.machine";
import {
	getPathDescription,
	addMetaToStates,
} from "../../shared/utils/test.utils";

const timerMachineMeta = {
	running: {
		tests: [
			{
				description: "should NOT have a START button",
				test: (queryByTestId) => {
					expect(queryByTestId("START-button")).toBeFalsy();
				},
			},
			{
				description: "should have a PAUSE button",
				test: (queryByTestId) => {
					expect(queryByTestId("PAUSE-button")).toBeTruthy();
				},
			},
			{
				description: "should NOT have a CONTINUE button",
				test: (queryByTestId) => {
					expect(queryByTestId("CONTINUE-button")).toBeFalsy();
				},
			},
			{
				description: "should have a STOP button",
				test: (queryByTestId) => {
					expect(queryByTestId("STOP-button")).toBeTruthy();
				},
			},
			{
				description: "should have DECREASED value after time",
				test: (queryByTestId) => {
					expect(queryByTestId("value").textContent).toBe("05:00.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("04:50.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("04:40.0");
				},
			},
		],
	},
	paused: {
		tests: [
			{
				description: "should NOT have a START button",
				test: (queryByTestId) => {
					expect(queryByTestId("START-button")).toBeFalsy();
				},
			},
			{
				description: "should NOT have a PAUSE button",
				test: (queryByTestId) => {
					expect(queryByTestId("PAUSE-button")).toBeFalsy();
				},
			},
			{
				description: "should have a CONTINUE button",
				test: (queryByTestId) => {
					expect(queryByTestId("CONTINUE-button")).toBeTruthy();
				},
			},
			{
				description: "should have a STOP button",
				test: (queryByTestId) => {
					expect(queryByTestId("STOP-button")).toBeTruthy();
				},
			},
			{
				description: "should have UNCHANGED value after time",
				test: (queryByTestId) => {
					expect(queryByTestId("value").textContent).toBe("05:00.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("05:00.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("05:00.0");
				},
			},
		],
	},
	idle: {
		tests: [
			{
				description: "should NOT have a START button",
				test: (queryByTestId) => {
					expect(queryByTestId("START-button")).toBeTruthy();
				},
			},
			{
				description: "should NOT have a PAUSE button",
				test: (queryByTestId) => {
					expect(queryByTestId("PAUSE-button")).toBeFalsy();
				},
			},
			{
				description: "should NOT have a CONTINUE button",
				test: (queryByTestId) => {
					expect(queryByTestId("CONTINUE-button")).toBeFalsy();
				},
			},
			{
				description: "should NOT have a STOP button",
				test: (queryByTestId) => {
					expect(queryByTestId("STOP-button")).toBeFalsy();
				},
			},
			{
				description: "should have UNCHANGED value after time",
				test: (queryByTestId) => {
					expect(queryByTestId("value").textContent).toBe("05:00.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("05:00.0");
					act(() => {
						vi.advanceTimersByTime(10000);
					});
					expect(queryByTestId("value").textContent).toBe("05:00.0");
				},
			},
		],
	},
};

const paths = getSimplePaths(
  createMachine(
    addMetaToStates(TimerMachine.config, timerMachineMeta),
    TimerMachine.implementations
  ),
  {
    events: [
      { type: "SET_INITIAL_VALUE", payload: { initialValue: 1000 } },
      { type: "START" },
      { type: "PAUSE" },
      { type: "CONTINUE" },
      { type: "STOP" },
    ],
  }
);

describe("Timer after steps", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	paths.forEach((path) => {
		const pathStateMeta = path.state.getMeta()[`timer.${path.state.value}`];

		if (pathStateMeta && pathStateMeta.tests) {
			describe(getPathDescription(path), () => {
				pathStateMeta.tests.forEach(({ description, test }) => {
					it(description, () => {
						const { getByTestId, queryByTestId } = render(<Timer />);

						path.steps.forEach((step) => {
							switch (step.event.type) {
								case "xstate.init":
									break;

								case "SET_INITIAL_VALUE":
									act(() => {
										fireEvent.click(getByTestId("5-min"));
									});
									break;

								case "START":
									act(() => {
										fireEvent.click(getByTestId("START-button"));
									});
									break;

								case "PAUSE":
									act(() => {
										fireEvent.click(getByTestId("PAUSE-button"));
									});
									break;

								case "CONTINUE":
									act(() => {
										fireEvent.click(getByTestId("CONTINUE-button"));
									});
									break;

								case "STOP":
									act(() => {
										fireEvent.click(getByTestId("STOP-button"));
									});
									break;

								default:
									throw new Error(`Unhandled event type: ${event.type}`);
							}
						});

						test(queryByTestId);
					});
				});
			});
		}
	});
});
