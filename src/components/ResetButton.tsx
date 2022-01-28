type Props = {
  resetFunc: () => void;
};

export const ResetButton: React.FC<Props> = ({ resetFunc }) => {
  return <button onClick={resetFunc}>Сбросить </button>;
};
