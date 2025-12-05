'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push(redirectTo);
    } else if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // User is authenticated but doesn't have the required role
      router.push('/unauthorized');
    }
  }, [isAuthenticated, loading, requiredRole, router, user?.role, redirectTo]);

  if (loading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
