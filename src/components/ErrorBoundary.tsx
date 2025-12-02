import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, you would send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-center text-gray-600 mb-6">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                  <p className="text-xs font-mono text-red-600 break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors active:scale-95"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors active:scale-95"
                >
                  Reload
                </button>
              </div>

              {/* Support Link */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Still having issues?{' '}
                <a href="mailto:support@chronotask.com" className="text-blue-600 hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
