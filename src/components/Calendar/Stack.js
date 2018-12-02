import React from 'react';
import uuid from 'uuid';

export const DIRECTION = {
  HORIZONTAL_REVERSE: uuid(),
  HORIZONTAL: uuid(),
  VERTICAL_REVERSE: uuid(),
  VERTICAL: uuid(),
};

export const DISTRIBUTION = {
  AROUND: uuid(),
  BETWEEN: uuid(),
  CENTER: uuid(),
  END: uuid(),
  NORMAL: uuid(),
  START: uuid(),
  STRETCH: uuid(),
};

export const ALIGN = {
  CENTER: uuid(),
  END: uuid(),
  NORMAL: uuid(),
  START: uuid(),
};

const definition = {
  // Direction
  [DIRECTION.HORIZONTAL_REVERSE]: 'row-reverse',
  [DIRECTION.HORIZONTAL]: 'row',
  [DIRECTION.VERTICAL_REVERSE]: 'column-reverse',
  [DIRECTION.VERTICAL]: 'column',

  // Distribution
  [DISTRIBUTION.AROUND]: 'space-around',
  [DISTRIBUTION.BETWEEN]: 'space-between',
  [DISTRIBUTION.CENTER]: 'center',
  [DISTRIBUTION.END]: 'flex-end',
  [DISTRIBUTION.NORMAL]: 'normal',
  [DISTRIBUTION.START]: 'flex-start',
  [DISTRIBUTION.STRETCH]: 'stretch',

  // Alignment
  [ALIGN.CENTER]: 'center',
  [ALIGN.END]: 'flex-end',
  [ALIGN.NORMAL]: 'normal',
  [ALIGN.START]: 'flex-start',
};

export const Stack = React.forwardRef((props, ref) => {
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
        display: 'flex',
        flexDirection: definition[direction],
        justifyContent: definition[distribution],
        alignItems: definition[align],
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

Stack.direction = DIRECTION;
Stack.distribution = DISTRIBUTION;
Stack.align = ALIGN;

Stack.displayName = 'Stack';
