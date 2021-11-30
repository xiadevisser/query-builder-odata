import { QueryType, LogicalOperator } from './constants';
import { FilterBuilder } from './filter-builder';

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
    const q: string[] = [field];
    if (callbacks.length > 0) {
      const b = new QueryBuilder();
      callbacks.forEach(c => c(b));
      q.push(b.toSubQuery());
    }
    this.addQuery(QueryType.expand, q.join(''), ',');
    return this;
  }
  public filter(...callbacks: ((builder: FilterBuilder) => void)[]): QueryBuilder {
    if (callbacks.length > 0) {
      const q: string[] = [];
      const filterBuilder = new FilterBuilder();
      callbacks.forEach(c => c(filterBuilder));
      q.push(filterBuilder.toQuery());
      this.addQuery(QueryType.filter, q.join(''), ` ${LogicalOperator.and} `);
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
    const queryKeys = Object.keys(this.query);
    if (queryKeys.length > 0) {
      return '?' + queryKeys.map(q => `${q}${this.query[q]}`).join('&');
    }
    return '';
  }
  private toSubQuery(): string {
    return '(' + Object.keys(this.query).map(q => `${q}${this.query[q]}`).join(';') + ')';
  }
}
