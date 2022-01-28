import { createContext, useReducer, useCallback, useEffect } from 'react';

export type QueueItem = {
  promise: () => Promise<void>;
  resolve: (value: any) => any;
  reject: (value: any) => any;
  timer: string;
};

enum Action_Types {
  updateLog = '@timers/UPDATE_LOG',
  resetTimers = '@timers/RESET_TIMERS',
  addItemToQueue = '@timers/ADD_ITEM_TO_QUEUE',
  removeItemFromQueue = '@timers/REMOVE_ITEM_FROM_QUEUE',
  changePendingStatus = '@timers/CHANGE_PENDING_STATUS',
}

export interface ITimersState {
  timers: number[];
  log: string[] | [];
  pendingStatus: boolean;
  stop: boolean;
  queue: Array<QueueItem> | [];
}

const initialState: ITimersState = {
  timers: [1, 2, 3, 4],
  log: [],
  pendingStatus: false,
  stop: false,
  queue: [],
};

type TimerNumber = typeof initialState.timers[number];

export interface IContextState {
  state: ITimersState;
  startTimer?: (timer: TimerNumber) => void;
  resetTimer?: () => void;
}

export const TimerContext = createContext<IContextState>({
  state: initialState,
});

interface IUpdateLog {
  type: Action_Types.updateLog;
  payload: string;
}

interface IResetTimer {
  type: Action_Types.resetTimers;
}

interface IAddItemToQueue {
  type: Action_Types.addItemToQueue;
  payload: QueueItem;
}

interface IRemoveItemFromQueue {
  type: Action_Types.removeItemFromQueue;
}

interface IChangePendingStatus {
  type: Action_Types.changePendingStatus;
}

export type Actions =
  | IUpdateLog
  | IResetTimer
  | IAddItemToQueue
  | IRemoveItemFromQueue
  | IChangePendingStatus;

const reducer = (state: ITimersState, action: Actions) => {
  switch (action.type) {
    case Action_Types.updateLog:
      return { ...state, log: [...state.log, action.payload] };
    case Action_Types.addItemToQueue:
      return { ...state, queue: [...state.queue, action.payload] };
    case Action_Types.removeItemFromQueue:
      const newQueue = [...state.queue];
      newQueue.shift();
      return { ...state, queue: newQueue };
    case Action_Types.resetTimers:
      return { ...initialState };
    case Action_Types.changePendingStatus: {
      return { ...state, pendingStatus: !state.pendingStatus };
    }
    default:
      return state;
  }
};

export const TimersProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.pendingStatus) {
      return;
    }
    const item = state.queue[0];
    if (!item) {
      return;
    }
    try {
      dispatch({ type: Action_Types.removeItemFromQueue });
      dispatch({ type: Action_Types.changePendingStatus });
      item.promise().then((value) => {
        dispatch({ type: Action_Types.changePendingStatus });

        item.resolve(value);
      });
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const delay = async (timer: TimerNumber) => {
    const startTime = new Date().toLocaleTimeString();
    await new Promise((resolve) =>
      setTimeout(() => resolve('done'), 1000 * timer)
    );
    dispatch({
      type: Action_Types.updateLog,
      payload: `${startTime} | таймер:${timer} | ${new Date().toLocaleTimeString()}`,
    });
  };

  const addToQueue = (timer: TimerNumber, promise: () => Promise<void>) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: Action_Types.addItemToQueue,
        payload: { promise, resolve, reject, timer: 'Таймер:' + timer },
      });
    });
  };

  const startTimer = useCallback((timer: TimerNumber) => {
    addToQueue(timer, () => delay(timer));
  }, []);

  const resetTimer = useCallback(() => {
    dispatch({ type: Action_Types.resetTimers });
  }, [dispatch]);

  return (
    <TimerContext.Provider value={{ state, startTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
