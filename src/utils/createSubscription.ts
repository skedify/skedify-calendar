type CancelFn = () => void;

export function createSubscription() {
  let subscriptions: CancelFn[] = [];

  return {
    cancel() {
      subscriptions.forEach((cancel) => cancel());
      subscriptions = [];
    },
    add(subscription: CancelFn) {
      if (!subscription) return;

      subscriptions.push(subscription);
    },
  };
}
