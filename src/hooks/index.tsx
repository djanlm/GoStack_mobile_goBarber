/** Reune todos os providers, assim a quantidade de codigo no app se torna menor. Em vez de exportar um provider de cada vez, exporta só esse aqui contendo todos */
import React from 'react';

import { AuthProvider } from './auth';


const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default AppProvider;
