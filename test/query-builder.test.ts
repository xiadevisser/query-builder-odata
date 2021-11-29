import { QueryBuilder } from "../src/query-builder";

it('should return empty array without options', () => {
  const query = new QueryBuilder().toQuery();
  const expected = "";
  expect(query).toEqual(expected);
});

describe('top', () => {
  it('should return top', () => {
    const query = new QueryBuilder().top(10).toQuery();
    const expected = "?$top=10";
    expect(query).toEqual(expected);
  });
  it('should return top with last value with multiple top calls', () => {
    const query = new QueryBuilder().top(10).top(15).toQuery();
    const expected = "?$top=15";
    expect(query).toEqual(expected);
  });
});

describe('skip', () => {
  it('should return skip', () => {
    const query = new QueryBuilder().skip(10).toQuery();
    const expected = "?$skip=10";
    expect(query).toEqual(expected);
  });
  it('should return skip with last value with multiple skip calls', () => {
    const query = new QueryBuilder().skip(10).skip(15).toQuery();
    const expected = "?$skip=15";
    expect(query).toEqual(expected);
  });
});

describe('count', () => {
  it('should return count', () => {
    const query = new QueryBuilder().count().toQuery();
    const expected = "?$count=true";
    expect(query).toEqual(expected);
  });
  it('should return count with multiple count calls', () => {
    const query = new QueryBuilder().count().count().toQuery();
    const expected = "?$count=true";
    expect(query).toEqual(expected);
  });
});

describe('select', () => {
  it('should return select', () => {
    const query = new QueryBuilder().select('id', 'name').toQuery();
    const expected = "?$select=id,name";
    expect(query).toEqual(expected);
  });
  it('should return joint select with multiple select calls', () => {
    const query = new QueryBuilder().select('id', 'name').select('age').toQuery();
    const expected = "?$select=id,name,age";
    expect(query).toEqual(expected);
  });
});

describe('orderBy', () => {
  it('should return orderby', () => {
    const query = new QueryBuilder().orderBy('id desc', 'name').toQuery();
    const expected = "?$orderby=id desc,name";
    expect(query).toEqual(expected);
  });
  it('should return joint orderby with multiple orderBy calls', () => {
    const query = new QueryBuilder().orderBy('id desc', 'name').orderBy('age asc').toQuery();
    const expected = "?$orderby=id desc,name,age asc";
    expect(query).toEqual(expected);
  });
});

describe('expand', () => {
  it('should return expand without nesting', () => {
    const query = new QueryBuilder().expand('Books').toQuery();
    const expected = "?$expand=Books";
    expect(query).toEqual(expected);
  });
  it('should return expand with select and expand nesting', () => {
    const query = new QueryBuilder().expand('Books', e => e.select('id', 'name').expand('Chapters')).toQuery();
    const expected = "?$expand=Books($select=id,name;$expand=Chapters)";
    expect(query).toEqual(expected);
  });
  it('should return expand with filter nesting', () => {
    const query = new QueryBuilder().expand('Books', e => e.filter(f => f.eq('id', 1))).toQuery();
    const expected = "?$expand=Books($filter=id eq 1)";
    expect(query).toEqual(expected);
  });
  it('should return joint expand with multiple expand calls', () => {
    const query = new QueryBuilder().expand('Books').expand('Friends', e => e.select('id', 'name')).toQuery();
    const expected = "?$expand=Books,Friends($select=id,name)";
    expect(query).toEqual(expected);
  });
});

describe('filter', () => {
  it('should return filter with one comparison operator', () => {
    const query = new QueryBuilder().filter(f => f.eq('name', 'John Doe')).toQuery();
    const expected = "?$filter=name eq 'John Doe'";
    expect(query).toEqual(expected);
  });
  it('should return filter with default and operator', () => {
    const query = new QueryBuilder().filter(f => f.eq('name', 'John Doe').eq('id', 1)).toQuery();
    const expected = "?$filter=name eq 'John Doe' and id eq 1";
    expect(query).toEqual(expected);
  });
  it('should return filter with or operator', () => {
    const query = new QueryBuilder().filter(f => f.or(a => a.eq('name', 'John Doe').eq('id', 1))).toQuery();
    const expected = "?$filter=name eq 'John Doe' or id eq 1";
    expect(query).toEqual(expected);
  });
  it('should return empty string if filter is empty', () => {
    const query = new QueryBuilder().filter().toQuery();
    const expected = "";
    expect(query).toEqual(expected);
  });
  it('should return filter with double nesting', () => {
    const query = new QueryBuilder().filter(f =>
      f.or(o => o
        .eq('name', 'John Doe')
        .eq('id', 1)
        .and(a => a
          .eq('name', 'Jane')
          .eq('rating', 5)
        )
      )
    ).toQuery();
    const expected = "?$filter=name eq 'John Doe' or id eq 1 or (name eq 'Jane' and rating eq 5)";
    expect(query).toEqual(expected);
  });
  it('should return joint filter with multiple filter calls', () => {
    const query = new QueryBuilder()
    .filter(f => f.eq('id', 1))
    .filter(f => f.eq('name', 'John Doe'))
    .toQuery();
    const expected = "?$filter=id eq 1 and name eq 'John Doe'";
    expect(query).toEqual(expected);
  });
});

it('should return query from the readme', () => {
  const query = new QueryBuilder()
    .top(10)
    .skip(10)
    .count()
    .select('name')
    .orderBy('name')
    .expand('Books', e => e.select('title'))
    .filter(f => f.eq('name', 'John Doe'))
    .toQuery();
  const expected = "?$top=10&$skip=10&$count=true&$select=name&$orderby=name&$expand=Books($select=title)&$filter=name eq 'John Doe'";
  expect(query).toEqual(expected);
});
