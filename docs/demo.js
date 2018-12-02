import React, { Component } from 'react';

import Calendar from '../src/components/Calendar/Calendar';

import '../src/styles.css';
import './demo-styles.css';

import { ComponentMeasurer } from '../src/components/Calendar/ComponentMeasurer';
import { Stack } from '../src/components/Calendar/Stack';

export class EventCapturer extends Component {
  static displayName = 'SkedifyEventCapturer';

  state = {
    events: [],
    height: 0,
  };

  ref = React.createRef();

  componentDidUpdate() {
    requestAnimationFrame(() => {
      this.ref.current.scrollTop = this.ref.current.scrollHeight;
    });
  }

  capture = (...args) => {
    this.setState(state => ({
      events: [...state.events, args],
    }));
  };

  render() {
    const { events, height } = this.state;
    const { render } = this.props;

    return (
      <Stack>
        <Ratio
          onUpdate={info => this.setState({ height: info.height })}
          ratio={16 / 9}
        >
          {render({ capture: this.capture })}
        </Ratio>
        <div
          className="Demo__ListOfEvents"
          ref={this.ref}
          style={{
            height,
          }}
        >
          <h3 style={{ margin: 0 }}>Actions</h3>
          <div>
            {events.map(([name, ...event], index) => (
              <React.Fragment key={index}>
                <span>
                  <small>{index + 1}. </small>
                  <strong>{name}</strong>
                </span>
                <pre className="Demo__ListOfEvents__Snippet">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </React.Fragment>
            ))}
            {events.length === 0 && (
              <pre className="Demo__ListOfEvents__Snippet">
                No actions happened yet...
              </pre>
            )}
          </div>
        </div>
      </Stack>
    );
  }
}

export function Sandbox({ children }) {
  if (children.type.displayName === EventCapturer.displayName) {
    return children;
  }

  return <Ratio ratio={16 / 9}>{children}</Ratio>;
}

export function Ratio({ ratio, children, onUpdate }) {
  const value = 1 / ratio;

  return (
    <ComponentMeasurer
      onUpdate={onUpdate}
      render={({ ref, width }) => (
        <div
          ref={ref}
          style={{
            width: '100%',
            height: width !== undefined ? width * value : undefined,
          }}
        >
          {children}
        </div>
      )}
    />
  );
}

export default Calendar;
