import { useContext } from 'react';
import { TimerContext, IContextState } from './context/timerContex';
import { TimerButton } from './components/TimerButton';
import { ResetButton } from './components/ResetButton';
import { LogViewport } from './components/LogViewport';
import { Queue } from './components/Queue';

const noop = () => {};

function App() {
  const {
    state: { timers, log, queue },
    startTimer = noop,
    resetTimer = noop,
  } = useContext<IContextState>(TimerContext);

  return (
    <main className='main'>
      <section className='buttons'>
        <div>
          {timers?.map((timer: number) => (
            <TimerButton
              key={timer}
              timerNumber={timer}
              startTimer={startTimer}
            />
          ))}
        </div>
        <ResetButton resetFunc={resetTimer} />
      </section>
      <section className='logs'>
        <LogViewport data={log} />
        <Queue queue={queue} />
      </section>
    </main>
  );
}

export default App;
