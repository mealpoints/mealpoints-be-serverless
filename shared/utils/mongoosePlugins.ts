/* eslint-disable unicorn/no-null */
import {
  Document,
  Model,
  PopulateOptions,
  Schema,
  SchemaTimestampsConfig,
  SortOrder,
} from "mongoose";

export interface PaginateOptions {
  page?: number;
  limit?: number;
  sort?:
    | string
    | { [key: string]: SortOrder | { $meta: unknown } }
    | [string, SortOrder][]
    | undefined
    | null;
  select?:
    | string
    | string[]
    | Record<string, number | boolean | string | object>;
  populate?: PopulateOptions | (string | PopulateOptions)[];
}

export interface PaginateResult<T> {
  documents: T[];
  totalDocuments: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(query: object, options: PaginateOptions): Promise<PaginateResult<T>>;
}

export function paginatePlugin<T extends Document>(
  schema: Schema<T & SchemaTimestampsConfig>
) {
  schema.statics.paginate = async function (
    this: Model<T>,
    query: object,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sort = options.sort ?? {};
    const select = options.select ?? "";
    const populate = options.populate ?? [];

    const skip = (page - 1) * limit;

    const [documents, totalDocuments] = await Promise.all([
      this.find(query)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .exec(),
      this.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      documents,
      totalDocuments,
      limit,
      totalPages,
      page,
      pagingCounter: skip + 1,
      hasPrevPage: hasPreviousPage,
      hasNextPage,
      prevPage: hasPreviousPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };
  };
}
