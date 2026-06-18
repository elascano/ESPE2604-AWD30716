declare function $config(config: {
  app(input?: { stage?: string }): {
    name: string;
    removal?: "retain" | "remove";
    protect?: boolean;
    home?: "aws";
  };
  run(): Promise<Record<string, unknown>> | Record<string, unknown>;
}): unknown;

declare namespace $util {
  type Output<T> = T;
}

declare namespace sst {
  namespace aws {
    class ApiGatewayV2 {
      public readonly url: string;

      constructor(name: string, args?: Record<string, unknown>);

      route(route: string, args: Record<string, unknown>): void;
    }
  }
}
