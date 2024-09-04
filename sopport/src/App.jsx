import { useState } from 'react';
import Header from './api/Header.jsx';
import Body from './api/Body.jsx';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
        {/* <Header /> */}
        <Body />
    </div>

  )
}

export default App
