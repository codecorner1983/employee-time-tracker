import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Employee } from './types';

function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const handleLogin = (employee: Employee) => {
    setCurrentEmployee(employee);
  };

  const handleLogout = () => {
    setCurrentEmployee(null);
  };

  return (
    <div className="App">
      {currentEmployee ? (
        <Dashboard currentEmployee={currentEmployee} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;