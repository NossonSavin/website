import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import Template from './Template';
import Clock from './Clock';
import Timer from './Timer';
import AnalogClock from './AnalogClock';
import Snake from './Snake';
import Robot from './Robot';
import Website from './Website';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Template />}>
        <Route index element={<HomePage />} />
        <Route path='clock' element={<Clock />} />
        <Route path='timer' element={<Timer />} />
        <Route path='website' element={<Website />} />
        <Route path='robot' element={<Robot />} />
        <Route path='jsclock' element={<AnalogClock />} />
        <Route path='snake' element={<Snake />} />
        <Route path='*' element={<ErrorPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
