import React from 'react';
import { render } from 'react-dom';

const App: React.FC = () => {
  return <p>Hello World</p>;
};

render(<App />, document.getElementById('root'));
