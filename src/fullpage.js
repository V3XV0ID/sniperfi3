import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

document.body.style.width = '100%';
document.body.style.height = '100vh';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App fullPage={true} />);