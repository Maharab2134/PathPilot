import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen py-16 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-2xl px-4 mx-auto text-center sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-12">
            <h1 className="mb-4 text-5xl font-bold text-secondary-900 dark:text-white">404</h1>
            <p className="mb-8 text-secondary-600 dark:text-secondary-400">
              Oops! The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
