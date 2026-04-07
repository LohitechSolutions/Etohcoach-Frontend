import React from 'react';

export default function highlightColor(color) {
  switch (color) {
    case 'yellow':
      return 'yellow';
    case 'lightgreen':
      return 'lightgreen';
    case 'Orange':
      return 'orange';
    case 'Red':
      return '#ff0000';
    case 'pink':
      return '#d06ecb';
    case 'lightblue':
      return '#82e5ff';
    case 'lightgreen':
      return null;
    case null:
      return null;

    default:
      alert('Farbfehler');
  }
}
