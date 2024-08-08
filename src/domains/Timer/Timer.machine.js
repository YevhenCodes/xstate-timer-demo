import { assign, createMachine, fromCallback } from 'xstate';
import { getDateAfterMilliseconds, getMillisecondsTillDate } from './Timer.utils';

const TICK_INTERVAL = 100; // milliseconds
const DEFAULT_TIMER_VALUE = 5 * 60 * 1000; // 5 minutes

export const TimerMachine = createMachine(
    {
        id: 'timer',
        initial: 'idle',
        context: () => ({
            endDate: null,
            remainingValue: DEFAULT_TIMER_VALUE,
        }),
        on: {
            SET_INITIAL_VALUE: {
                target: '.idle',
                actions: ['setInitialValue'],
            },
        },
        states: {
            idle: {
                on: {
                    START: 'running',
                },
            },
            running: {
                invoke: {
                    id: 'ticking',
                    src: 'ticking'
                },
                entry: ['setEndDate', 'updateRemainingValue'],
                on: {
                    PAUSE: 'paused',
                    STOP: 'stopped',
                    TICK: [
                        {
                            target: 'finished',
                            guard: 'timerFinished'
                        },
                        {
                            actions: ['updateRemainingValue'],
                        },
                    ],
                }
            },
            paused: {
                entry: ['clearEndDate'],
                on: {
                    CONTINUE: 'running',
                    STOP: 'stopped',
                }
            },
            stopped: {
                entry: ['clearEndDate', 'clearRemainingValue'],
                always: 'idle'
            },
            finished: {
                entry: ['playSound', 'clearEndDate', 'clearRemainingValue'],
                always: 'idle'
            },
        },
    },
    {
        actions: {
            setInitialValue: assign({
                remainingValue: ({ event }) => {
                    return event.payload?.initialValue;
                },
            }),
            setEndDate: assign({
                endDate: ({ context }) => {
                    return getDateAfterMilliseconds(context.remainingValue).toISOString();
                },
            }),
            clearEndDate: assign({
                endDate: () => null,
            }),
            updateRemainingValue: assign({
                remainingValue: ({context}) => {
                    return getMillisecondsTillDate(context.endDate);
                },
            }),
            clearRemainingValue: assign({
                remainingValue: () => DEFAULT_TIMER_VALUE,
            }),
            playSound: () => new Audio('sound.mp3').play().catch(() => {})
        },
        guards: {
            timerFinished: ({context}) => context.remainingValue === 0
        },
        actors: {
            ticking: fromCallback(({ sendBack }) => {
                const intervalId = setInterval(() => {
                    sendBack({ type: 'TICK' });
                }, TICK_INTERVAL);
              
                return () => clearInterval(intervalId);
            })
        }
    }
);
