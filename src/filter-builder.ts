import { LogicalOperator, ComparisonOperator, StringOperator, ParameterType } from './constants';
import { replaceSpecialCharacters } from './helper';

export class FilterBuilder {
  private filter: string[] = [];
  private operator: LogicalOperator;

  constructor(operator?: LogicalOperator) {
    this.operator = operator ?? LogicalOperator.and;
  }

  public and(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.and, callbacks);
  }
  public or(...callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.or, callbacks);
  }

  public eq(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.eq, [value], type);
  }
  public ne(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ne, [value], type);
  }
  public gt(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.gt, [value], type);
  }
  public ge(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ge, [value], type);
  }
  public lt(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.lt, [value], type);
  }
  public le(property: string, value: string | number, type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.le, [value], type);
  }
  public in(property: string, values: (string | number)[], type?: ParameterType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.in, values, type);
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
  private logical(op: LogicalOperator, callbacks: ((buider: FilterBuilder) => void)[]): FilterBuilder {
    const b = new FilterBuilder(op);
    callbacks.forEach(c => c(b));
    this.filter.push(`(${b.toQuery()})`);
    return this;
  }
  private comparison(property: string, op: ComparisonOperator, values: (string | number | Date)[], type?: ParameterType): FilterBuilder {
    const value = this.stringify(values, type);
    this.filter.push(`${property} ${op} ${value}`);
    return this;
  }
  private stringFunction(op: StringOperator, property: string, value: string | number): FilterBuilder {
    value = this.stringify([value]);
    this.filter.push(`${op}(${property}, ${value})`);
    return this;
  }
  private stringify(values: (string | number | Date)[], type?: ParameterType): string {
    if (type === undefined) {
      values = values.map(v => typeof v === 'string' ? `'${replaceSpecialCharacters(v)}'` : v);
    }
    // do nothing with the current parameter types
    const value = values.join(',');
    return values.length > 1 ? `(${value})` : value;
  }
}
