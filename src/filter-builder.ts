import { LogicalOperator, ComparisonOperator, StringOperator } from './constants';

export class FilterBuilder {
  private filter: string[] = [];
  private operator: LogicalOperator;

  constructor(operator?: LogicalOperator) {
    this.operator = operator ?? LogicalOperator.and;
  }

  public and(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.and, ...callbacks);
  }
  public or(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.or, ...callbacks);
  }

  public eq(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.eq, value);
  }
  public ne(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ne, value);
  }
  public gt(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.gt, value);
  }
  public ge(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ge, value);
  }
  public lt(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.lt, value);
  }
  public le(property: string, value: string | number): FilterBuilder {
    return this.comparison(property, ComparisonOperator.le, value);
  }
  public in(property: string, values: (string | number)[]): FilterBuilder {
    return this.comparison(property, ComparisonOperator.in, ...values);
  }

  public startsWith(property: string, value: string | number): FilterBuilder {
    return this.stringFunction(StringOperator.startsWith, property, value);
  }
  public endsWith(property: string, value: string | number): FilterBuilder {
    return this.stringFunction(StringOperator.endsWith, property, value);
  }
  public contains(property: string, value: string | number): FilterBuilder {
    return this.stringFunction(StringOperator.contains, property, value);
  }

  public toQuery(): string {
    const f = this.filter.join(` ${this.operator} `);
    return f.match(/^\(.*\)$/) ? f.substr(1, f.length - 2) : f;
  }
  private logical(op: LogicalOperator, ...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    const b = new FilterBuilder(op);
    callbacks.forEach(c => c(b));
    this.filter.push(`(${b.toQuery()})`);
    return this;
  }
  private comparison(property: string, op: ComparisonOperator, ...values: (string | number)[]): FilterBuilder {
    const value = this.stringify(...values);
    this.filter.push(`${property} ${op} ${value}`);
    return this;
  }
  private stringFunction(op: string, property: StringOperator, value: string | number): FilterBuilder {
    value = this.stringify(value);
    this.filter.push(`${op}(${property}, ${value})`);
    return this;
  }
  private stringify(...values: (string | number)[]): string {
    values = values.map(v => typeof v === 'string' ? `'${v}'` : v);
    const value = values.join(',');
    return values.length > 1 ? `(${value})` : value;
  }
}
