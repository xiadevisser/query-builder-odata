import { ParameterType } from '../src/constants';
import { QueryBuilder } from '../src/query-builder';

describe('and', () => {
  it('should return and', () => {
    const query = new QueryBuilder().filter(f => f.and(a => a
      .eq('name', 'John Doe')
      .eq('id', 1)
    )).toQuery();
    const expected = '?$filter=name eq \'John Doe\' and id eq 1';
    expect(query).toEqual(expected);
  });
});

describe('or', () => {
  it('should return or', () => {
    const query = new QueryBuilder().filter(f => f.or(o => o
      .eq('name', 'John Doe')
      .eq('id', 1)
    )).toQuery();
    const expected = '?$filter=name eq \'John Doe\' or id eq 1';
    expect(query).toEqual(expected);
  });
});

describe('eq', () => {
  it('should return eq', () => {
    const query = new QueryBuilder().filter(f => f.eq('name', 'John Doe')).toQuery();
    const expected = '?$filter=name eq \'John Doe\'';
    expect(query).toEqual(expected);
  });
});

describe('ne', () => {
  it('should return ne', () => {
    const query = new QueryBuilder().filter(f => f.ne('name', 'John Doe')).toQuery();
    const expected = '?$filter=name ne \'John Doe\'';
    expect(query).toEqual(expected);
  });
});

describe('gt', () => {
  it('should return gt', () => {
    const query = new QueryBuilder().filter(f => f.gt('rating', 5)).toQuery();
    const expected = '?$filter=rating gt 5';
    expect(query).toEqual(expected);
  });
});

describe('ge', () => {
  it('should return ge', () => {
    const query = new QueryBuilder().filter(f => f.ge('rating', 5)).toQuery();
    const expected = '?$filter=rating ge 5';
    expect(query).toEqual(expected);
  });
});

describe('lt', () => {
  it('should return lt', () => {
    const query = new QueryBuilder().filter(f => f.lt('rating', 5)).toQuery();
    const expected = '?$filter=rating lt 5';
    expect(query).toEqual(expected);
  });
});

describe('le', () => {
  it('should return le', () => {
    const query = new QueryBuilder().filter(f => f.le('rating', 5)).toQuery();
    const expected = '?$filter=rating le 5';
    expect(query).toEqual(expected);
  });
});

describe('in', () => {
  it('should return in', () => {
    const query = new QueryBuilder().filter(f => f.in('rating', [1, 10])).toQuery();
    const expected = '?$filter=rating in (1,10)';
    expect(query).toEqual(expected);
  });
});

describe('startsWith', () => {
  it('should return startsWith', () => {
    const query = new QueryBuilder().filter(f => f.startsWith('name', 'John')).toQuery();
    const expected = '?$filter=startswith(name, \'John\')';
    expect(query).toEqual(expected);
  });
});

describe('endsWith', () => {
  it('should return endsWith', () => {
    const query = new QueryBuilder().filter(f => f.endsWith('name', 'Doe')).toQuery();
    const expected = '?$filter=endswith(name, \'Doe\')';
    expect(query).toEqual(expected);
  });
});

describe('contains', () => {
  it('should return contains', () => {
    const query = new QueryBuilder().filter(f => f.contains('name', 'John')).toQuery();
    const expected = '?$filter=contains(name, \'John\')';
    expect(query).toEqual(expected);
  });
});

describe('comparison operators with optional parameter types', () => {
  it('datetime', () => {
    const query = new QueryBuilder()
      .filter(f => f.eq('publishdate', '2022-02-01', ParameterType.datetime))
      .toQuery();
    const expected = '?$filter=publishdate eq 2022-02-01';
    expect(query).toEqual(expected);
  });
  it('guid', () => {
    const query = new QueryBuilder()
      .filter(f => f.eq('guid', '7bd6b28d-68e7-4d21-b540-3377380ce468', ParameterType.guid))
      .toQuery();
    const expected = '?$filter=guid eq 7bd6b28d-68e7-4d21-b540-3377380ce468';
    expect(query).toEqual(expected);
  }); 
});