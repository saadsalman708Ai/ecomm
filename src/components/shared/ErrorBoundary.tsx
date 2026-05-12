import React, { Component, ErrorInfo, ReactNode } from 'react';
import { WifiOff, RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.setState({ isOffline: false });
    // If we recovered connection and there was an error, we can attempt a subtle auto-retry
    if (this.state.hasError) {
      this.handleRetry();
    }
  };

  private handleOffline = () => {
    this.setState({ isOffline: true });
  };

  private handleRetry = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setState({ isOffline: true });
      return;
    }

    const isChunkLoadError = this.state.error?.name === 'ChunkLoadError' || 
                             this.state.error?.message?.includes('fetch') ||
                             this.state.error?.message?.includes('dynamically imported module') ||
                             this.state.error?.message?.includes('Loading chunk');

    if (isChunkLoadError) {
      // It's safe to reload now because we know we are online
      window.location.reload();
    } else {
      // For non-chunk errors, we try to recover without a full page reload by clearing the error state
      this.setState({ hasError: false, error: null, isOffline: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkLoadError = this.state.error?.name === 'ChunkLoadError' || 
                               this.state.error?.message?.includes('fetch') ||
                               this.state.error?.message?.includes('dynamically imported module') ||
                               this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
            {this.state.isOffline || isChunkLoadError ? (
              <WifiOff size={40} className="text-gray-400" />
            ) : (
              <AlertTriangle size={40} className="text-orange-400" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            {this.state.isOffline ? "You're offline" : (isChunkLoadError ? 'Connection Interrupted' : 'Something went wrong')}
          </h2>
          
          <p className="text-gray-500 mb-8 max-w-md text-base leading-relaxed">
            {this.state.isOffline 
              ? "It looks like you've lost your internet connection. Please turn it back on to continue."
              : (isChunkLoadError 
                ? "We couldn't load this part of the app. Your connection might have glitched, or we just released a new update."
                : "An unexpected error occurred while loading this page. We've been notified and are looking into it.")}
          </p>
          
          <button 
            onClick={this.handleRetry}
            disabled={this.state.isOffline}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98] ${
              this.state.isOffline 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow border border-primary'
            }`}
          >
            <RefreshCcw size={18} />
            {this.state.isOffline ? 'Waiting for connection...' : 'Try Again'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
