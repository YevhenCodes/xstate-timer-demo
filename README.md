# xState timer demo

[![Generative integration tests status](https://github.com/YevhenCodes/xstate-timer-demo/actions/workflows/node.js.yml/badge.svg)](https://github.com/YevhenCodes/xstate-timer-demo/actions/workflows/node.js.yml)

It's a simple timer app that uses [xState](https://xstate.js.org/) to manage the state of the timer. It allows user to set the timer and displays the remaining time. The timer can be paused, resumed, continued and stopped. 

![State machine visualization](./demo.gif)

## Why it's interesting
* The whole state of the timer [described and managed as a state machine](https://github.com/YevhenCodes/xstate-timer-demo/blob/main/src/domains/Timer/Timer.machine.js).
* It's a **timed** state machine. The remaining value update and ticking interval is implemented on top of the actor.
* Timer has 1/10 of the second precision, which makes it more interesting to implement.
* Timer is [covered with generative integration tests](https://github.com/YevhenCodes/xstate-timer-demo/blob/main/src/domains/Timer/Timer.spec.jsx). *@xstate/graph* is used to generate state machine paths, steps from which are transformed into test actions.
![Generative tests example](./test-example.jpg)


## State machine visualization with [Stately](https://stately.ai/)

![State machine visualization](./visualization.jpg)