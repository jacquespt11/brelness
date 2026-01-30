// src/app/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/shared/components/ui';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Premium Error Boundary Component
 * Catches runtime errors and displays a beautiful fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-purple-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
                            ⚠️
                        </div>
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-3">
                            Oups ! Quelque chose s'est mal passé.
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                            Une erreur inattendue est survenue. Nous avons été informés et nous travaillons pour résoudre le problème.
                        </p>

                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={this.handleReset}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 border-none shadow-lg shadow-purple-200 dark:shadow-none"
                            >
                                Retourner à l'accueil
                            </Button>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => window.location.reload()}
                            >
                                Recharger la page
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-left border border-gray-100 dark:border-gray-700 overflow-auto">
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Détails techniques :</p>
                                <code className="text-xs text-red-500 font-mono break-all whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
