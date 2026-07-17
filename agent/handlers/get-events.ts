import { coreV1 } from "../k8s-client";

export async function getEvents(
  namespace?: string
) {
  const response = namespace
    ? await coreV1.listNamespacedEvent(
        namespace
      )
    : await coreV1.listEventForAllNamespaces();

  return response.body.items.map(
    (event) => ({
      type: event.type,
      reason: event.reason,
      message: event.message,
      namespace:
        event.metadata?.namespace,
    })
  );
}