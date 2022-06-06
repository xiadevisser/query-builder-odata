import { LogicalOperator, ComparisonOperator, StringOperator, DataType } from './constants';
import { replaceSpecialCharacters } from './helper';

export class FilterBuilder {
  private filter: string[] = [];
  private operator: LogicalOperator;

  constructor(operator?: LogicalOperator) {
    this.operator = operator ?? LogicalOperator.and;
  }

  public and(...callbacks: ((builder: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.and, callbacks);
  }
  public or(...callbacks: ((builder: FilterBuilder) => void)[]): FilterBuilder {
    return this.logical(LogicalOperator.or, callbacks);
  }

  public eq(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.eq, [value], type);
  }
  public ne(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ne, [value], type);
  }
  public gt(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.gt, [value], type);
  }
  public ge(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.ge, [value], type);
  }
  public lt(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.lt, [value], type);
  }
  public le(property: string, value: string | number | Date, type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.le, [value], type);
  }
  public in(property: string, values: (string | number | Date)[], type?: DataType): FilterBuilder {
    return this.comparison(property, ComparisonOperator.in, values, type);
  }

  public startsWith(property: string, value: string | number, type?: DataType): FilterBuilder {
    return this.stringFunction(StringOperator.startsWith, property, value, type);
  }
  public endsWith(property: string, value: string | number, type?: DataType): FilterBuilder {
    return this.stringFunction(StringOperator.endsWith, property, value, type);
  }
  public contains(property: string, value: string | number, type?: DataType): FilterBuilder {
    return this.stringFunction(StringOperator.contains, property, value, type);
  }

  public toQuery(): string {
    const f = this.filter.join(` ${this.operator} `);
    return f.match(/^\(.*\)$/) ? f.slice(1, f.length - 1) : f;
  }
  private logical(op: LogicalOperator, callbacks: ((builder: FilterBuilder) => void)[]): FilterBuilder {
    const b = new FilterBuilder(op);
    callbacks.forEach(c => c(b));
    this.filter.push(`(${b.toQuery()})`);
    return this;
  }
  private comparison(property: string, op: ComparisonOperator, values: (string | number | Date)[], type?: DataType): FilterBuilder {
    const value = this.stringify(values, type);
    this.filter.push(`${property} ${op} ${value}`);
    return this;
  }
  private stringFunction(op: StringOperator, property: string, value: string | number, type?: DataType): FilterBuilder {
    value = this.stringify([value], type);
    this.filter.push(`${op}(${property}, ${value})`);
    return this;
  }
  private stringify(values: (string | number | Date)[], type?: DataType): string {
    if (type === undefined) {
      values = values.map(v => {
        if (typeof v === 'string') {
          return `'${replaceSpecialCharacters(v)}'`;
        } else if (v instanceof Date) {
          return v.toISOString();
        } else {
          return v;
        }
      });
    }
    // do nothing with the current datatypes
    const value = values.join(',');
    return values.length > 1 ? `(${value})` : value;
  }
}
