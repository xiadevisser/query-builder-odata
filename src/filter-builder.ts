export class FilterBuilder {
  private filter: string[] = [];
  private operator: string;
  constructor(operator?: string) {
    this.operator = operator ?? 'and';
  }
  public and(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical('and', ...callbacks);
  }
  public or(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical('or', ...callbacks);
  }
  public eq(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'eq', value);
  }
  public ne(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'ne', value)
  }
  public gt(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'gt', value)
  }
  public ge(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'ge', value)
  }
  public lt(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'lt', value)
  }
  public le(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, 'le', value)
  }
  public in(property: string, values: (string | number)[]): FilterBuilder {
    return this.comparison(property, 'in', ...values);
  }
  public startsWith(property: string, value: string | number): FilterBuilder {
    return this.stringFunction('startswith', property, value);
  }
  public endsWith(property: string, value: string | number): FilterBuilder {
    return this.stringFunction('endswith', property, value);
  }
  public contains(property: string, value: string | number): FilterBuilder {
    return this.stringFunction('contains', property, value);
  }
  public toQuery(): string {
    let f = this.filter.join(` ${this.operator} `);
    return f.match(/^\(.*\)$/) ? f.substr(1, f.length - 2) : f;
  }
  private logical(op: string, ...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    let b = new FilterBuilder(op);
    callbacks.forEach(c => c(b));
    this.filter.push(`(${b.toQuery()})`);
    return this;
  }
  private comparison(property: string, op: string, ...values: (string | number)[]): FilterBuilder {
    const value = this.stringify(...values);
    this.filter.push(`${property} ${op} ${value}`);
    return this;
  }
  private stringFunction(op: string, property: string, value: string | number): FilterBuilder {
    value = this.stringify(value);
    this.filter.push(`${op}(${property}, ${value})`);
    return this;
  }
  private stringify(...values: (string | number)[]): string {
    values = values.map(v => typeof v == 'string' ? `'${v}'` : v);
    const value = values.join(',');
    return values.length > 1 ? `(${value})` : value;
  }
}
