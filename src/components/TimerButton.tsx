type Props = {
  timerNumber: number;
  startTimer: any;
};

export const TimerButton: React.FC<Props> = ({ timerNumber, startTimer }) => {
  return (
    <button className='timerButton' onClick={() => startTimer(timerNumber)}>
      Таймер {timerNumber}
    </button>
  );
};
