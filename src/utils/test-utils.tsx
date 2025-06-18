import React from 'react';
import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: ReactNode;
  session?: { user: { id: string; role: 'user' | 'admin'; name?: string; email?: string; } } & { expires: string; } | null;
};

export const Providers = ({ children, session }: Props) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};
