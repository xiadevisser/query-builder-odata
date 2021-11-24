import { FilterBuilder } from "./filter-builder";

export class QueryBuilder {
  private query: string[] = [];
  public top(top: number): QueryBuilder {
    this.query.push(`$top=${top}`);
    return this;
  }
  public skip(skip: number): QueryBuilder {
    this.query.push(`$skip=${skip}`);
    return this;
  }
  public count(): QueryBuilder {
    this.query.push(`$count=true`);
    return this;
  }
  public select(fields: string): QueryBuilder {
    this.query.push(`$select=${fields}`);
    return this;
  }
  public orderBy(fields: string): QueryBuilder {
    this.query.push(`$orderBy=${fields}`);
    return this;
  }
  public expand(field: string, ...callbacks: ((builder: QueryBuilder) => void)[]): QueryBuilder {
    let q: string = `$expand=${field}`;
    if (callbacks.length > 0) {
      let b = new QueryBuilder();
      callbacks.forEach(c => c(b));
      q += b.toSubQuery();
    }
    this.query.push(q);
    return this;
  }
  public filter(...callbacks: ((builder: FilterBuilder) => void)[]): QueryBuilder {
    if (callbacks.length > 0) {
      let q: string = `$filter=`;
      var filterBuilder = new FilterBuilder();
      callbacks.forEach(c => c(filterBuilder));
      q += filterBuilder.toQuery()
      this.query.push(q);
    }
    return this;
  }
  public toQuery(): string {
    if (this.query.length > 0) {
      return '?' + this.query.join('&');
    }
    return "";
  }
  private toSubQuery(): string {
    return '(' + this.query.join(';') + ')';
  }
}