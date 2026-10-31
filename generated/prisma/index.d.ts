
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FlightPlan
 * 
 */
export type FlightPlan = $Result.DefaultSelection<Prisma.$FlightPlanPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FlightPlans
 * const flightPlans = await prisma.flightPlan.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FlightPlans
   * const flightPlans = await prisma.flightPlan.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.flightPlan`: Exposes CRUD operations for the **FlightPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlightPlans
    * const flightPlans = await prisma.flightPlan.findMany()
    * ```
    */
  get flightPlan(): Prisma.FlightPlanDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    FlightPlan: 'FlightPlan'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "flightPlan"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      FlightPlan: {
        payload: Prisma.$FlightPlanPayload<ExtArgs>
        fields: Prisma.FlightPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlightPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlightPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          findFirst: {
            args: Prisma.FlightPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlightPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          findMany: {
            args: Prisma.FlightPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>[]
          }
          create: {
            args: Prisma.FlightPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          createMany: {
            args: Prisma.FlightPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlightPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>[]
          }
          delete: {
            args: Prisma.FlightPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          update: {
            args: Prisma.FlightPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          deleteMany: {
            args: Prisma.FlightPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlightPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlightPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>[]
          }
          upsert: {
            args: Prisma.FlightPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlightPlanPayload>
          }
          aggregate: {
            args: Prisma.FlightPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlightPlan>
          }
          groupBy: {
            args: Prisma.FlightPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlightPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlightPlanCountArgs<ExtArgs>
            result: $Utils.Optional<FlightPlanCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    flightPlan?: FlightPlanOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model FlightPlan
   */

  export type AggregateFlightPlan = {
    _count: FlightPlanCountAggregateOutputType | null
    _min: FlightPlanMinAggregateOutputType | null
    _max: FlightPlanMaxAggregateOutputType | null
  }

  export type FlightPlanMinAggregateOutputType = {
    id: string | null
    flightDate: string | null
    startTime: string | null
    endTime: string | null
    area: string | null
    drone: string | null
    purpose: string | null
    createdAt: Date | null
  }

  export type FlightPlanMaxAggregateOutputType = {
    id: string | null
    flightDate: string | null
    startTime: string | null
    endTime: string | null
    area: string | null
    drone: string | null
    purpose: string | null
    createdAt: Date | null
  }

  export type FlightPlanCountAggregateOutputType = {
    id: number
    flightDate: number
    startTime: number
    endTime: number
    area: number
    drone: number
    purpose: number
    createdAt: number
    _all: number
  }


  export type FlightPlanMinAggregateInputType = {
    id?: true
    flightDate?: true
    startTime?: true
    endTime?: true
    area?: true
    drone?: true
    purpose?: true
    createdAt?: true
  }

  export type FlightPlanMaxAggregateInputType = {
    id?: true
    flightDate?: true
    startTime?: true
    endTime?: true
    area?: true
    drone?: true
    purpose?: true
    createdAt?: true
  }

  export type FlightPlanCountAggregateInputType = {
    id?: true
    flightDate?: true
    startTime?: true
    endTime?: true
    area?: true
    drone?: true
    purpose?: true
    createdAt?: true
    _all?: true
  }

  export type FlightPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlightPlan to aggregate.
     */
    where?: FlightPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlightPlans to fetch.
     */
    orderBy?: FlightPlanOrderByWithRelationInput | FlightPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlightPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlightPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlightPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlightPlans
    **/
    _count?: true | FlightPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlightPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlightPlanMaxAggregateInputType
  }

  export type GetFlightPlanAggregateType<T extends FlightPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateFlightPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlightPlan[P]>
      : GetScalarType<T[P], AggregateFlightPlan[P]>
  }




  export type FlightPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlightPlanWhereInput
    orderBy?: FlightPlanOrderByWithAggregationInput | FlightPlanOrderByWithAggregationInput[]
    by: FlightPlanScalarFieldEnum[] | FlightPlanScalarFieldEnum
    having?: FlightPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlightPlanCountAggregateInputType | true
    _min?: FlightPlanMinAggregateInputType
    _max?: FlightPlanMaxAggregateInputType
  }

  export type FlightPlanGroupByOutputType = {
    id: string
    flightDate: string
    startTime: string
    endTime: string
    area: string
    drone: string
    purpose: string
    createdAt: Date
    _count: FlightPlanCountAggregateOutputType | null
    _min: FlightPlanMinAggregateOutputType | null
    _max: FlightPlanMaxAggregateOutputType | null
  }

  type GetFlightPlanGroupByPayload<T extends FlightPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlightPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlightPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlightPlanGroupByOutputType[P]>
            : GetScalarType<T[P], FlightPlanGroupByOutputType[P]>
        }
      >
    >


  export type FlightPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flightDate?: boolean
    startTime?: boolean
    endTime?: boolean
    area?: boolean
    drone?: boolean
    purpose?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["flightPlan"]>

  export type FlightPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flightDate?: boolean
    startTime?: boolean
    endTime?: boolean
    area?: boolean
    drone?: boolean
    purpose?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["flightPlan"]>

  export type FlightPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flightDate?: boolean
    startTime?: boolean
    endTime?: boolean
    area?: boolean
    drone?: boolean
    purpose?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["flightPlan"]>

  export type FlightPlanSelectScalar = {
    id?: boolean
    flightDate?: boolean
    startTime?: boolean
    endTime?: boolean
    area?: boolean
    drone?: boolean
    purpose?: boolean
    createdAt?: boolean
  }

  export type FlightPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "flightDate" | "startTime" | "endTime" | "area" | "drone" | "purpose" | "createdAt", ExtArgs["result"]["flightPlan"]>

  export type $FlightPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlightPlan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      flightDate: string
      startTime: string
      endTime: string
      area: string
      drone: string
      purpose: string
      createdAt: Date
    }, ExtArgs["result"]["flightPlan"]>
    composites: {}
  }

  type FlightPlanGetPayload<S extends boolean | null | undefined | FlightPlanDefaultArgs> = $Result.GetResult<Prisma.$FlightPlanPayload, S>

  type FlightPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlightPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlightPlanCountAggregateInputType | true
    }

  export interface FlightPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlightPlan'], meta: { name: 'FlightPlan' } }
    /**
     * Find zero or one FlightPlan that matches the filter.
     * @param {FlightPlanFindUniqueArgs} args - Arguments to find a FlightPlan
     * @example
     * // Get one FlightPlan
     * const flightPlan = await prisma.flightPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlightPlanFindUniqueArgs>(args: SelectSubset<T, FlightPlanFindUniqueArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FlightPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlightPlanFindUniqueOrThrowArgs} args - Arguments to find a FlightPlan
     * @example
     * // Get one FlightPlan
     * const flightPlan = await prisma.flightPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlightPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, FlightPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlightPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanFindFirstArgs} args - Arguments to find a FlightPlan
     * @example
     * // Get one FlightPlan
     * const flightPlan = await prisma.flightPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlightPlanFindFirstArgs>(args?: SelectSubset<T, FlightPlanFindFirstArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlightPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanFindFirstOrThrowArgs} args - Arguments to find a FlightPlan
     * @example
     * // Get one FlightPlan
     * const flightPlan = await prisma.flightPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlightPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, FlightPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FlightPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlightPlans
     * const flightPlans = await prisma.flightPlan.findMany()
     * 
     * // Get first 10 FlightPlans
     * const flightPlans = await prisma.flightPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flightPlanWithIdOnly = await prisma.flightPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlightPlanFindManyArgs>(args?: SelectSubset<T, FlightPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FlightPlan.
     * @param {FlightPlanCreateArgs} args - Arguments to create a FlightPlan.
     * @example
     * // Create one FlightPlan
     * const FlightPlan = await prisma.flightPlan.create({
     *   data: {
     *     // ... data to create a FlightPlan
     *   }
     * })
     * 
     */
    create<T extends FlightPlanCreateArgs>(args: SelectSubset<T, FlightPlanCreateArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FlightPlans.
     * @param {FlightPlanCreateManyArgs} args - Arguments to create many FlightPlans.
     * @example
     * // Create many FlightPlans
     * const flightPlan = await prisma.flightPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlightPlanCreateManyArgs>(args?: SelectSubset<T, FlightPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FlightPlans and returns the data saved in the database.
     * @param {FlightPlanCreateManyAndReturnArgs} args - Arguments to create many FlightPlans.
     * @example
     * // Create many FlightPlans
     * const flightPlan = await prisma.flightPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FlightPlans and only return the `id`
     * const flightPlanWithIdOnly = await prisma.flightPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlightPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, FlightPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FlightPlan.
     * @param {FlightPlanDeleteArgs} args - Arguments to delete one FlightPlan.
     * @example
     * // Delete one FlightPlan
     * const FlightPlan = await prisma.flightPlan.delete({
     *   where: {
     *     // ... filter to delete one FlightPlan
     *   }
     * })
     * 
     */
    delete<T extends FlightPlanDeleteArgs>(args: SelectSubset<T, FlightPlanDeleteArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FlightPlan.
     * @param {FlightPlanUpdateArgs} args - Arguments to update one FlightPlan.
     * @example
     * // Update one FlightPlan
     * const flightPlan = await prisma.flightPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlightPlanUpdateArgs>(args: SelectSubset<T, FlightPlanUpdateArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FlightPlans.
     * @param {FlightPlanDeleteManyArgs} args - Arguments to filter FlightPlans to delete.
     * @example
     * // Delete a few FlightPlans
     * const { count } = await prisma.flightPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlightPlanDeleteManyArgs>(args?: SelectSubset<T, FlightPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlightPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlightPlans
     * const flightPlan = await prisma.flightPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlightPlanUpdateManyArgs>(args: SelectSubset<T, FlightPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlightPlans and returns the data updated in the database.
     * @param {FlightPlanUpdateManyAndReturnArgs} args - Arguments to update many FlightPlans.
     * @example
     * // Update many FlightPlans
     * const flightPlan = await prisma.flightPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FlightPlans and only return the `id`
     * const flightPlanWithIdOnly = await prisma.flightPlan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlightPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, FlightPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FlightPlan.
     * @param {FlightPlanUpsertArgs} args - Arguments to update or create a FlightPlan.
     * @example
     * // Update or create a FlightPlan
     * const flightPlan = await prisma.flightPlan.upsert({
     *   create: {
     *     // ... data to create a FlightPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlightPlan we want to update
     *   }
     * })
     */
    upsert<T extends FlightPlanUpsertArgs>(args: SelectSubset<T, FlightPlanUpsertArgs<ExtArgs>>): Prisma__FlightPlanClient<$Result.GetResult<Prisma.$FlightPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FlightPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanCountArgs} args - Arguments to filter FlightPlans to count.
     * @example
     * // Count the number of FlightPlans
     * const count = await prisma.flightPlan.count({
     *   where: {
     *     // ... the filter for the FlightPlans we want to count
     *   }
     * })
    **/
    count<T extends FlightPlanCountArgs>(
      args?: Subset<T, FlightPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlightPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlightPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlightPlanAggregateArgs>(args: Subset<T, FlightPlanAggregateArgs>): Prisma.PrismaPromise<GetFlightPlanAggregateType<T>>

    /**
     * Group by FlightPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlightPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlightPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlightPlanGroupByArgs['orderBy'] }
        : { orderBy?: FlightPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlightPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlightPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlightPlan model
   */
  readonly fields: FlightPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlightPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlightPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FlightPlan model
   */
  interface FlightPlanFieldRefs {
    readonly id: FieldRef<"FlightPlan", 'String'>
    readonly flightDate: FieldRef<"FlightPlan", 'String'>
    readonly startTime: FieldRef<"FlightPlan", 'String'>
    readonly endTime: FieldRef<"FlightPlan", 'String'>
    readonly area: FieldRef<"FlightPlan", 'String'>
    readonly drone: FieldRef<"FlightPlan", 'String'>
    readonly purpose: FieldRef<"FlightPlan", 'String'>
    readonly createdAt: FieldRef<"FlightPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FlightPlan findUnique
   */
  export type FlightPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter, which FlightPlan to fetch.
     */
    where: FlightPlanWhereUniqueInput
  }

  /**
   * FlightPlan findUniqueOrThrow
   */
  export type FlightPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter, which FlightPlan to fetch.
     */
    where: FlightPlanWhereUniqueInput
  }

  /**
   * FlightPlan findFirst
   */
  export type FlightPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter, which FlightPlan to fetch.
     */
    where?: FlightPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlightPlans to fetch.
     */
    orderBy?: FlightPlanOrderByWithRelationInput | FlightPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlightPlans.
     */
    cursor?: FlightPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlightPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlightPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlightPlans.
     */
    distinct?: FlightPlanScalarFieldEnum | FlightPlanScalarFieldEnum[]
  }

  /**
   * FlightPlan findFirstOrThrow
   */
  export type FlightPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter, which FlightPlan to fetch.
     */
    where?: FlightPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlightPlans to fetch.
     */
    orderBy?: FlightPlanOrderByWithRelationInput | FlightPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlightPlans.
     */
    cursor?: FlightPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlightPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlightPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlightPlans.
     */
    distinct?: FlightPlanScalarFieldEnum | FlightPlanScalarFieldEnum[]
  }

  /**
   * FlightPlan findMany
   */
  export type FlightPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter, which FlightPlans to fetch.
     */
    where?: FlightPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlightPlans to fetch.
     */
    orderBy?: FlightPlanOrderByWithRelationInput | FlightPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlightPlans.
     */
    cursor?: FlightPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlightPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlightPlans.
     */
    skip?: number
    distinct?: FlightPlanScalarFieldEnum | FlightPlanScalarFieldEnum[]
  }

  /**
   * FlightPlan create
   */
  export type FlightPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * The data needed to create a FlightPlan.
     */
    data: XOR<FlightPlanCreateInput, FlightPlanUncheckedCreateInput>
  }

  /**
   * FlightPlan createMany
   */
  export type FlightPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlightPlans.
     */
    data: FlightPlanCreateManyInput | FlightPlanCreateManyInput[]
  }

  /**
   * FlightPlan createManyAndReturn
   */
  export type FlightPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * The data used to create many FlightPlans.
     */
    data: FlightPlanCreateManyInput | FlightPlanCreateManyInput[]
  }

  /**
   * FlightPlan update
   */
  export type FlightPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * The data needed to update a FlightPlan.
     */
    data: XOR<FlightPlanUpdateInput, FlightPlanUncheckedUpdateInput>
    /**
     * Choose, which FlightPlan to update.
     */
    where: FlightPlanWhereUniqueInput
  }

  /**
   * FlightPlan updateMany
   */
  export type FlightPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlightPlans.
     */
    data: XOR<FlightPlanUpdateManyMutationInput, FlightPlanUncheckedUpdateManyInput>
    /**
     * Filter which FlightPlans to update
     */
    where?: FlightPlanWhereInput
    /**
     * Limit how many FlightPlans to update.
     */
    limit?: number
  }

  /**
   * FlightPlan updateManyAndReturn
   */
  export type FlightPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * The data used to update FlightPlans.
     */
    data: XOR<FlightPlanUpdateManyMutationInput, FlightPlanUncheckedUpdateManyInput>
    /**
     * Filter which FlightPlans to update
     */
    where?: FlightPlanWhereInput
    /**
     * Limit how many FlightPlans to update.
     */
    limit?: number
  }

  /**
   * FlightPlan upsert
   */
  export type FlightPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * The filter to search for the FlightPlan to update in case it exists.
     */
    where: FlightPlanWhereUniqueInput
    /**
     * In case the FlightPlan found by the `where` argument doesn't exist, create a new FlightPlan with this data.
     */
    create: XOR<FlightPlanCreateInput, FlightPlanUncheckedCreateInput>
    /**
     * In case the FlightPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlightPlanUpdateInput, FlightPlanUncheckedUpdateInput>
  }

  /**
   * FlightPlan delete
   */
  export type FlightPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
    /**
     * Filter which FlightPlan to delete.
     */
    where: FlightPlanWhereUniqueInput
  }

  /**
   * FlightPlan deleteMany
   */
  export type FlightPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlightPlans to delete
     */
    where?: FlightPlanWhereInput
    /**
     * Limit how many FlightPlans to delete.
     */
    limit?: number
  }

  /**
   * FlightPlan without action
   */
  export type FlightPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlightPlan
     */
    select?: FlightPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlightPlan
     */
    omit?: FlightPlanOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FlightPlanScalarFieldEnum: {
    id: 'id',
    flightDate: 'flightDate',
    startTime: 'startTime',
    endTime: 'endTime',
    area: 'area',
    drone: 'drone',
    purpose: 'purpose',
    createdAt: 'createdAt'
  };

  export type FlightPlanScalarFieldEnum = (typeof FlightPlanScalarFieldEnum)[keyof typeof FlightPlanScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type FlightPlanWhereInput = {
    AND?: FlightPlanWhereInput | FlightPlanWhereInput[]
    OR?: FlightPlanWhereInput[]
    NOT?: FlightPlanWhereInput | FlightPlanWhereInput[]
    id?: StringFilter<"FlightPlan"> | string
    flightDate?: StringFilter<"FlightPlan"> | string
    startTime?: StringFilter<"FlightPlan"> | string
    endTime?: StringFilter<"FlightPlan"> | string
    area?: StringFilter<"FlightPlan"> | string
    drone?: StringFilter<"FlightPlan"> | string
    purpose?: StringFilter<"FlightPlan"> | string
    createdAt?: DateTimeFilter<"FlightPlan"> | Date | string
  }

  export type FlightPlanOrderByWithRelationInput = {
    id?: SortOrder
    flightDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    area?: SortOrder
    drone?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
  }

  export type FlightPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlightPlanWhereInput | FlightPlanWhereInput[]
    OR?: FlightPlanWhereInput[]
    NOT?: FlightPlanWhereInput | FlightPlanWhereInput[]
    flightDate?: StringFilter<"FlightPlan"> | string
    startTime?: StringFilter<"FlightPlan"> | string
    endTime?: StringFilter<"FlightPlan"> | string
    area?: StringFilter<"FlightPlan"> | string
    drone?: StringFilter<"FlightPlan"> | string
    purpose?: StringFilter<"FlightPlan"> | string
    createdAt?: DateTimeFilter<"FlightPlan"> | Date | string
  }, "id">

  export type FlightPlanOrderByWithAggregationInput = {
    id?: SortOrder
    flightDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    area?: SortOrder
    drone?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
    _count?: FlightPlanCountOrderByAggregateInput
    _max?: FlightPlanMaxOrderByAggregateInput
    _min?: FlightPlanMinOrderByAggregateInput
  }

  export type FlightPlanScalarWhereWithAggregatesInput = {
    AND?: FlightPlanScalarWhereWithAggregatesInput | FlightPlanScalarWhereWithAggregatesInput[]
    OR?: FlightPlanScalarWhereWithAggregatesInput[]
    NOT?: FlightPlanScalarWhereWithAggregatesInput | FlightPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FlightPlan"> | string
    flightDate?: StringWithAggregatesFilter<"FlightPlan"> | string
    startTime?: StringWithAggregatesFilter<"FlightPlan"> | string
    endTime?: StringWithAggregatesFilter<"FlightPlan"> | string
    area?: StringWithAggregatesFilter<"FlightPlan"> | string
    drone?: StringWithAggregatesFilter<"FlightPlan"> | string
    purpose?: StringWithAggregatesFilter<"FlightPlan"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FlightPlan"> | Date | string
  }

  export type FlightPlanCreateInput = {
    id?: string
    flightDate: string
    startTime: string
    endTime: string
    area: string
    drone: string
    purpose: string
    createdAt?: Date | string
  }

  export type FlightPlanUncheckedCreateInput = {
    id?: string
    flightDate: string
    startTime: string
    endTime: string
    area: string
    drone: string
    purpose: string
    createdAt?: Date | string
  }

  export type FlightPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flightDate?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    drone?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlightPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flightDate?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    drone?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlightPlanCreateManyInput = {
    id?: string
    flightDate: string
    startTime: string
    endTime: string
    area: string
    drone: string
    purpose: string
    createdAt?: Date | string
  }

  export type FlightPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    flightDate?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    drone?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlightPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    flightDate?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    drone?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FlightPlanCountOrderByAggregateInput = {
    id?: SortOrder
    flightDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    area?: SortOrder
    drone?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
  }

  export type FlightPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    flightDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    area?: SortOrder
    drone?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
  }

  export type FlightPlanMinOrderByAggregateInput = {
    id?: SortOrder
    flightDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    area?: SortOrder
    drone?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}