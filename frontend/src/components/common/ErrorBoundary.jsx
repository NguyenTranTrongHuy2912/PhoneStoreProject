import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error boundary:', error, info);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-3">
            <div className="text-2xl font-bold text-gray-900">Da co loi xay ra</div>
            <p className="text-sm text-gray-500">Vui long tai lai trang hoac quay ve trang chu.</p>
            <button
              type="button"
              onClick={this.handleReload}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full"
            >
              Ve trang chu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
