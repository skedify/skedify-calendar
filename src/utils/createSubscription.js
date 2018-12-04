import { isFunction } from './isFunction';

export function createSubscription() {
  const subscriptions = [];

  return {
    cancel() {
      subscriptions.splice(0, subscriptions.length).forEach(cancel => {
        if (!isFunction(cancel)) {
          return;
        }

        cancel();
      });
    },
    add(subscription) {
      if (!isFunction(subscription)) {
        return;
      }

      subscriptions.push(subscription);
    },
  };
}
