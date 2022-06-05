export class QueryType {
  public static readonly top = 'top';
  public static readonly skip = 'skip';
  public static readonly count = 'count';
  public static readonly select = 'select';
  public static readonly orderBy = 'orderby';
  public static readonly expand = 'expand';
  public static readonly filter = 'filter';
}

export class LogicalOperator {
  public static readonly or = 'or';
  public static readonly and = 'and';
}

export class ComparisonOperator {
  public static readonly eq = 'eq';
  public static readonly ne = 'ne';
  public static readonly gt = 'gt';
  public static readonly ge = 'ge';
  public static readonly lt = 'lt';
  public static readonly le = 'le';
  public static readonly in = 'in';
}

export class StringOperator {
  public static readonly startsWith = 'startswith';
  public static readonly endsWith = 'endswith';
  public static readonly contains = 'contains';
}

export class ParameterType {
  public static readonly datetime = 'datetime';
  public static readonly guid = 'guid';
}
