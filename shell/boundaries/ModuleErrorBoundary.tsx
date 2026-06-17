"use client";

import { Component, type ReactNode } from "react";

interface Props {
  moduleId: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ModuleErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, border: "1px solid #ef4444", borderRadius: 8 }}>
          <strong>Module &quot;{this.props.moduleId}&quot; failed to load</strong>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
