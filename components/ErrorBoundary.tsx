"use client";

import React, { ReactNode, ReactElement } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 text-sm mb-6">
              {this.state.error?.message || "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#087B90] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#076870] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
