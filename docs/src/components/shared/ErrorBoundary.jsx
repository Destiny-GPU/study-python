import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return this.props.fallback || (
        <div style={{ padding: '1rem', color: 'var(--ifm-color-danger)' }}>
          Component failed to load.
        </div>
      );
    }
    return this.props.children;
  }
}
