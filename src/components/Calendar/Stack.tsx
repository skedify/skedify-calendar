import React from "react";

export enum DIRECTION {
  HORIZONTAL_REVERSE = "row-reverse",
  HORIZONTAL = "row",
  VERTICAL_REVERSE = "column-reverse",
  VERTICAL = "column",
}

export enum DISTRIBUTION {
  AROUND = "space-around",
  BETWEEN = "space-between",
  CENTER = "center",
  END = "flex-end",
  NORMAL = "normal",
  START = "flex-start",
  STRETCH = "stretch",
}

export enum ALIGN {
  CENTER = "center",
  END = "flex-end",
  NORMAL = "normal",
  START = "flex-start",
}

interface StackProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  direction?: DIRECTION;
  distribution?: DISTRIBUTION;
  align?: ALIGN;
}

interface IStack
  extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<StackProps> & React.RefAttributes<HTMLDivElement>
  > {
  direction: typeof DIRECTION;
  distribution: typeof DISTRIBUTION;
  align: typeof ALIGN;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    children,
    direction = Stack.direction.HORIZONTAL,
    distribution = Stack.distribution.BETWEEN,
    align = Stack.align.CENTER,
    style,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      style={{
        ...style,
        display: "flex",
        flexDirection: direction,
        justifyContent: distribution,
        alignItems: align,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}) as IStack;

Stack.direction = DIRECTION;
Stack.distribution = DISTRIBUTION;
Stack.align = ALIGN;
Stack.displayName = "Stack";
