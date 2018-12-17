///<reference types="seneca" />

declare function SenecaPromise(options: any): void;

export = SenecaPromise;

declare module "seneca" {

  type Responder<pattern = Pattern, params = any, response = any> = (this: Instance, msg: MessagePayload<pattern & params>) => Promise<response>

  interface Instance {

    addAsync<pattern = Pattern, params = any, response = any>(pattern: pattern, action: Responder<pattern, params, response>): this;
    addAsync<pattern = Pattern, params = any, response = any>(pattern: pattern, paramspec: params, action: Responder<pattern, params, response>): this;

    actAsync<pattern = Pattern, params = any, response = any>(pattern: pattern): Promise<response>;
    actAsync<pattern = Pattern, params = any, response = any>(pattern: pattern, paramspec: params): Promise<response>;

    wrapAsync<pattern = Pattern, params = any, response = any>(pattern: pattern, action: Responder<pattern, params, response>): this;
    wrapAsync<pattern = Pattern, params = any, response = any>(pattern: pattern, paramspec: params, action: Responder<pattern, params, response>): this;

    priorAsync<pattern = Pattern, response = any>(pattern: pattern): Promise<response>;

  }
}
