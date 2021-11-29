import { FilterBuilder } from "./filter-builder";

export class QueryBuilder {
  public query: { [key: string]: QueryType } = {};
  public top(top: number): QueryBuilder {
    this.setQuery(QueryType.top, `${top}`);
    return this;
  }
  public skip(skip: number): QueryBuilder {
    this.setQuery(QueryType.skip, `${skip}`);
    return this;
  }
  public count(): QueryBuilder {
    this.setQuery(QueryType.count, `${true}`);
    return this;
  }
  public select(...fields: string[]): QueryBuilder {
    this.addQuery(QueryType.select, fields.join(','), ',');
    return this;
  }
  public orderBy(...fields: string[]): QueryBuilder {
    this.addQuery(QueryType.orderBy, fields.join(','), ',');
    return this;
  }
  public expand(field: string, ...callbacks: ((builder: QueryBuilder) => void)[]): QueryBuilder {
    let q: string[] = [field];
    if (callbacks.length > 0) {
      let b = new QueryBuilder();
      callbacks.forEach(c => c(b));
      q.push(b.toSubQuery());
    }
    this.addQuery(QueryType.expand, q.join(''), ',');
    return this;
  }
  public filter(...callbacks: ((builder: FilterBuilder) => void)[]): QueryBuilder {
    if (callbacks.length > 0) {
      let q: string[] = [];
      var filterBuilder = new FilterBuilder();
      callbacks.forEach(c => c(filterBuilder));
      q.push(filterBuilder.toQuery());
      this.addQuery(QueryType.filter, q.join(''), ' and ');
    }
    return this;
  }
  private addQuery(type: QueryType, field: string, delimiter: string): void {
    const queryKey = `$${type}=`;
    if (this.query[queryKey]) {
      this.query[queryKey] += `${delimiter}${field}`;
    } else {
      this.query[queryKey] = field;
    }
  }
  private setQuery(type: QueryType, field: string): void {
    this.query[`$${type}=`] = field;
  }
  public toQuery(): string {
    if (Object.keys(this.query).length > 0) {
      let tmp: string[] = [];
      for (let q in this.query) {
        tmp.push(`${q}${this.query[q]}`);
      }
      return '?' + tmp.join('&');
    }
    return "";
  }
  private toSubQuery(): string {
    let tmp: string[] = [];
    for (let q in this.query) {
      tmp.push(`${q}${this.query[q]}`);
    }
    return '(' + tmp.join(';') + ')';
  }
}

class QueryType {
  public static readonly top = 'top';
  public static readonly skip = 'skip';
  public static readonly count = 'count';
  public static readonly select = 'select';
  public static readonly orderBy = 'orderby';
  public static readonly expand = 'expand';
  public static readonly filter = 'filter';
}
