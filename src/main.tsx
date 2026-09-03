import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import './index.css';

AppRegistry.registerComponent('App', () => App);

const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication('App', {
    initialProps: {},
    rootTag,
  });
}





