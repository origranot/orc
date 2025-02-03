type ServiceSpec = {
    type: string;
}

type PVSpec = {
    capacity: { storage: string };
}

type OrphanedResource<T> = {
    kind: string;
    name: string;
    namespace?: string;
    uid: string;
    age?: string;
    spec?: T;
    owner?: {
      apiVersion?: string;
      kind?: string;
      name?: string;
      uid?: string;
    } | null;
    reason: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
};