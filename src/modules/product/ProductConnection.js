// @flow
import type { ConnectionArguments } from 'graphql-relay';
import Product from './ProductLoader'
export const PREFIX = 'mongo:';

export const base64 = (str: string): string => Buffer.from(str, 'ascii').toString('base64');
export const unbase64 = (b64: string): string => Buffer.from(b64, 'base64').toString('ascii');

/**
 * Rederives the offset from the cursor string
 */
export const cursorToOffset = (cursor: string): number =>
  parseInt(unbase64(cursor).substring(PREFIX.length), 10);

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
export const getOffsetWithDefault = (cursor: ?string, defaultOffset: number): number => {
  if (cursor === undefined || cursor === null) {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
};

/**
 * Creates the cursor string from an offset.
 */
export const offsetToCursor = (offset: number): string => base64(PREFIX + offset);

export type TotalCountOptions = {
  cursor: Query<any, any>,
};

export const getTotalCount = async ({ cursor }: TotalCountOptions): number => {
  return cursor
};

export type OffsetOptions = {
  // Connection Args
  args: ConnectionArguments,
  // total Count
  totalCount: number,
};

export type PageInfoOffsets = {
  before: ?string,
  after: ?string,
  first: ?number,
  last: ?number,
  afterOffset: number,
  beforeOffset: number,
  startOffset: number,
  endOffset: number,
  startCursorOffset: number,
  endCursorOffset: number,
};

export type Offsets = PageInfoOffsets & {
  skip: number,
  limit: number,
};

export type PageInfoOptions<NodeType> = PageInfoOffsets & {
  edges: Array<{
    cursor: string,
    node: NodeType,
  }>,
  totalCount: number,
};

export const calculateOffsets = ({ args, totalCount }: OffsetOptions): Offsets => {
  const { after, before } = args;
  let { first, last } = args;

  // Limit the maximum number of elements in a query
  if (!first && !last) first = 10;
  if (first && first > 50) first = 50;
  if (last && last > 50) last = 50;

  const beforeOffset = getOffsetWithDefault(before, totalCount);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(totalCount, beforeOffset);

  if (first !== undefined && first !== null) {
    endOffset = Math.min(endOffset, startOffset + first);
  }

  if (last !== undefined && last !== null) {
    startOffset = Math.max(startOffset, endOffset - (last || 0));
  }

  const skip = Math.max(startOffset, 0);

  const limit = endOffset - startOffset;

  return {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    startCursorOffset: skip,
    endCursorOffset: limit + skip,
  };
};

export function getPageInfo<NodeType>({
  edges,
  // before,
  // after,
  // first,
  // last,
  // afterOffset,
  // beforeOffset,
  // startOffset,
  // endOffset,
  totalCount,
  startCursorOffset,
  endCursorOffset,
}: PageInfoOptions<NodeType>) {
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  // const lowerBound = after ? afterOffset + 1 : 0;
  // const upperBound = before ? Math.min(beforeOffset, totalCount) : totalCount;

  return {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: startCursorOffset > 0,
    hasNextPage: endCursorOffset < totalCount,
    // hasPreviousPage: last !== null ? startOffset > lowerBound : false,
    // hasNextPage: first !== null ? endOffset < upperBound : false,
  };
}

export type ConnectionOptionsCursor<LoaderResult, Ctx> = {
  context: Ctx,
  args: ConnectionArguments,
};

async function connectionFromVtex<LoaderResult, Ctx>({
  context,
  loader,
  args = {},
}: ConnectionOptionsCursor<LoaderResult, Ctx>) {
  const totalCount: number = 12383
  
  const {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    startCursorOffset,
    endCursorOffset,
  } = calculateOffsets({ args, totalCount });

  let data = await context.dataloaders.ProductLoader.load({
    ...args,
    _from: startOffset,
    _to: endOffset-1
  });
  const body = await data.json()
  const edges: Array<{
    cursor: string,
    node: LoaderResult,
  }> = body.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: new Product(value)
  }));

  return {
    edges,
    count: totalCount,
    endCursorOffset,
    startCursorOffset,
    pageInfo: getPageInfo({
      edges,
      before,
      after,
      first,
      last,
      afterOffset,
      beforeOffset,
      startOffset,
      endOffset,
      totalCount,
      startCursorOffset,
      endCursorOffset,
    }),
  };
}

export default connectionFromVtex;