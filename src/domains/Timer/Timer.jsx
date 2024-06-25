import { useMachine } from '@xstate/react';
import { TimerMachine } from './Timer.machine';
import { useConrolsList, useFormattedMilliseconds } from './Timer.hooks';
import './Timer.css';

const TIMER_OPTIONS = [1, 5, 10];

function Timer() {
    const [{ value, context }, send] = useMachine(TimerMachine);

    const controlsList = useConrolsList(value);
    const formattedRemaining = useFormattedMilliseconds(context.remainingValue)

    const handleTimerOptionClick = (option) => {
        send({ type: 'SET_INITIAL_VALUE', payload: { initialValue: option * 60 * 1000 }});
    }

    const handleControlButtonClick = (type) => {
        send({ type });
    }

    return (
        <div className="timer-container">
            <div className='timer-value'>
                {formattedRemaining}
            </div>

            <div className='timer-controls'>
                {controlsList.map((type) => (
                    <button key={type} onClick={() => handleControlButtonClick(type)}>{type}</button>
                ))}
            </div>

            <hr className='divider' />

            <div className='timer-options'>
                <span className='timer-options-label'>Set timer for</span>
                {TIMER_OPTIONS.map((option) => (
                    <button key={option} onClick={() => handleTimerOptionClick(option)}>{option} min</button>
                ))}
            </div>
        </div>
    );
}

export default Timer
