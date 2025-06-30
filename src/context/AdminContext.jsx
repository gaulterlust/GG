import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('isAdmin');
    return saved === 'true' ? true : false;
  });

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin);
  }, [isAdmin]);

  const loginAdmin = () => {
    const pass = prompt('Введи пароль адміністратора:');
    if (pass === 'DENhan20006') {  // <-- заміни на свій пароль
      setIsAdmin(true);
      alert('Адмін режим увімкнено');
    } else {
      alert('Невірний пароль');
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    alert('Адмін режим вимкнено');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
