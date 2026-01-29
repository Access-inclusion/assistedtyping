import { createBrowserRouter } from 'react-router';
import { TypingInterface } from './components/TypingInterface';
import { Settings } from './components/Settings';
import { RewardScreen } from './components/RewardScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: TypingInterface,
  },
  {
    path: '/settings',
    Component: Settings,
  },
  {
    path: '/reward',
    Component: RewardScreen,
  },
]);
