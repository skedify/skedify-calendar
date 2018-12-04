import { Component, createRef } from 'react';
import { isFunction } from '../../utils/isFunction';
import { createSubscription } from '../../utils/createSubscription';

export class ComponentMeasurer extends Component {
  constructor(...args) {
    super(...args);

    this.state = {};

    this.ref = createRef();
    this.subscriptions = createSubscription();
  }

  componentDidMount() {
    const rafId = requestAnimationFrame(this.handleResize);

    this.subscriptions.add(() => cancelAnimationFrame(rafId));

    if (window.ResizeObserver) {
      let resizeObserver = new ResizeObserver(this.handleResize);
      resizeObserver.observe(this.ref.current);

      this.subscriptions.add(() => {
        resizeObserver.disconnect(this.ref.current);
        resizeObserver = null;
      });
    } else {
      window.addEventListener('resize', this.handleResize);

      this.subscriptions.add(() => {
        window.removeEventListener('resize', this.handleResize);
      });
    }
  }

  componentWillUnmount() {
    this.subscriptions.cancel();
  }

  handleResize = () => {
    if (this.ref && this.ref.current) {
      const { onUpdate } = this.props;

      const finish = isFunction(onUpdate)
        ? () => onUpdate({ ref: this.ref, ...this.state })
        : undefined;

      this.setState(this.getSize(), finish);
    }
  };

  getSize() {
    if (!this.ref.current) {
      return {};
    }

    const { width, height } = this.ref.current.getBoundingClientRect();

    return {
      height,
      width,
      element: this.ref.current,
      rect: () => {
        const { top, left } = this.ref.current.getBoundingClientRect();
        return { top, left };
      },
    };
  }

  render() {
    const { render } = this.props;

    return render({
      ref: this.ref,
      ...this.state,
    });
  }
}
