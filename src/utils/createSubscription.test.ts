import { createSubscription } from "./createSubscription";

it("should be possible to create a subscription model", () => {
  const subscription = createSubscription();

  expect(subscription).toHaveProperty("cancel");
  expect(subscription).toHaveProperty("add");
});

it("should be possible to add subscriptions and cancel them", () => {
  const subscription = createSubscription();

  const subscription_a = jest.fn();
  const subscription_b = jest.fn();

  subscription.add(subscription_a);
  subscription.add(subscription_b);

  expect(subscription_a).not.toHaveBeenCalled();
  expect(subscription_b).not.toHaveBeenCalled();

  subscription.cancel();

  expect(subscription_a).toHaveBeenCalled();
  expect(subscription_b).toHaveBeenCalled();

  // Should be no-op's
  subscription.cancel();
  subscription.cancel();
  subscription.cancel();

  expect(subscription_a).toHaveBeenCalledTimes(1);
  expect(subscription_b).toHaveBeenCalledTimes(1);
});
