import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient
import Navigation from './Navigation'; // Your Navigation component

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation /> {/* Wrap your Navigation component */}
    </QueryClientProvider>
  );
};

export default App;
