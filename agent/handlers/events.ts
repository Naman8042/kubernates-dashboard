
import { coreV1 } from "../k8s-client";

export async function getEvents(
  namespace?: string
) {
  const response = namespace
    ? await coreV1.listNamespacedEvent(
        namespace
      )
    : await coreV1.listEventForAllNamespaces();

  return response.body.items
    .sort((a, b) => {
      const aTime =
        a.lastTimestamp
          ? new Date(
              a.lastTimestamp
            ).getTime()
          : 0;

      const bTime =
        b.lastTimestamp
          ? new Date(
              b.lastTimestamp
            ).getTime()
          : 0;

      return bTime - aTime;
    })
    .slice(0, 50)
    .map((event) => ({
      type: event.type,
      reason: event.reason,
      namespace:
        event.metadata?.namespace,
      object:
        event.involvedObject
          ?.name,
      message:
        event.message,
      timestamp:
        event.lastTimestamp,
    }));
}

