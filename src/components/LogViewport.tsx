export const LogViewport: React.FC<any> = ({ data }) => {
  const text = data.join('\n');
  return (
    <div>
      <p>Логи</p>
      <textarea className='textArea' value={text} readOnly />
    </div>
  );
};
