import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getMillisecondsTillDate = (date) => {
    const milliseconds = dayjs(date).diff(dayjs(), 'milliseconds');
    return milliseconds >= 0 ? milliseconds : 0;
};

export const getDateAfterMilliseconds = (milliseconds) => {
    return dayjs().add(milliseconds, 'milliseconds');
};

export const formatMilliseconds = (milliseconds) => {
    let format = 'mm:ss.SSS'
    if (milliseconds >= 60 * 60 * 1000) { // 1 hour
        format = 'H:mm:ss.SSS';
    }
    return dayjs
        .unix(0)
        .add(milliseconds, 'milliseconds')
        .utc()
        .format(format)
        .slice(0, -2); // trim 2 last digits of milliseconds (Day.js has no support of such formatting) 
};

export const getControlButtonsList = (state) => {
    switch (state) {
        case 'idle':
            return ['START'];
        case 'running':
            return ['PAUSE', 'STOP'];
        case 'paused':
            return ['CONTINUE', 'STOP'];
        default:
            return [];
    }
}