import React from 'react';
import { render } from 'react-dom';

import '../css/style.css';

const App: React.FC = () => {
  return (
    <div>
      <div className="hero">
        <h1 className="text-center text-3xl title">Hello</h1>
        <p className="text-center text-blue-500 text-2xl py-4">world</p>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
