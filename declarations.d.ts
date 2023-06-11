declare module '*.svg' {
  import React from 'react';
  import {ReactComponent} from 'react-native-svg';
  const content: React.FC<ReactComponent>;
  export default content;
}
