import { Component, createRef } from "react";

import { createSubscription } from "../../utils/createSubscription";

interface Props {
  onUpdate?: (args: Required<State>) => void;
  render: (args: { ref: React.RefObject<HTMLDivElement> } & State) => JSX.Element;
}

interface State {
  height?: number;
  width?: number;
  element?: HTMLDivElement;
  rect?: () => { top: number; left: number };
}

export class ComponentMeasurer extends Component<Props, State> {
  ref = createRef<HTMLDivElement>();
  subscriptions = createSubscription();
  state = {};

  componentDidMount() {
    const rafId = requestAnimationFrame(this.handleResize);

    this.subscriptions.add(() => cancelAnimationFrame(rafId));

    if (window.ResizeObserver) {
      let resizeObserver: ResizeObserver | null = new ResizeObserver(this.handleResize);
      this.ref.current && resizeObserver.observe(this.ref.current);

      this.subscriptions.add(() => {
        resizeObserver?.disconnect();
        resizeObserver = null;
      });
    } else {
      window.addEventListener("resize", this.handleResize);

      this.subscriptions.add(() => {
        window.removeEventListener("resize", this.handleResize);
      });
    }
  }

  componentWillUnmount() {
    this.subscriptions.cancel();
  }

  handleResize = () => {
    if (this.ref.current) {
      const { onUpdate } = this.props;

      //@ts-ignore we know state will be set when onUpdate is called;
      const finish = onUpdate ? () => onUpdate({ ...this.state }) : undefined;

      this.setState(this.getSize(), finish);
    }
  };

  getSize() {
    if (!this.ref.current) {
      return {};
    }

    const { height, width } = this.ref.current.getBoundingClientRect();

    return {
      height,
      width,
      element: this.ref.current!,
      rect: () => {
        const { left, top } = this.ref.current!.getBoundingClientRect();

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
