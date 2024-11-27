"use client"

import React from 'react';
import Page500 from './errors/500';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const Error500: React.FC<ErrorPageProps> = ({ error, reset }) => {
  return (
    <Page500/>
  );
};

export default Error500;
