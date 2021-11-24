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
});

describe('skip', () => {
  it('should return top', () => {
    const query = new QueryBuilder().skip(10).toQuery();
    const expected = "?$skip=10";
    expect(query).toEqual(expected);
  });
});

describe('count', () => {
  it('should return count', () => {
    const query = new QueryBuilder().count().toQuery();
    const expected = "?$count=true";
    expect(query).toEqual(expected);
  });
});

describe('select', () => {
  it('should return select', () => {
    const query = new QueryBuilder().select('id,name').toQuery();
    const expected = "?$select=id,name";
    expect(query).toEqual(expected);
  });
});

describe('orderBy', () => {
  it('should return orderBy', () => {
    const query = new QueryBuilder().orderBy('id desc,name').toQuery();
    const expected = "?$orderBy=id desc,name";
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
    const query = new QueryBuilder().expand('Books', e => { e.select('id,name'); e.expand('Chapters') }).toQuery();
    const expected = "?$expand=Books($select=id,name;$expand=Chapters)";
    expect(query).toEqual(expected);
  });
  it('should return expand with filter nesting', () => {
    const query = new QueryBuilder().expand('Books', e => e.filter(f => f.eq('id', 1))).toQuery();
    const expected = "?$expand=Books($filter=id eq 1)";
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
    const query = new QueryBuilder().filter(f => { f.eq('name', 'John Doe'); f.eq('id', 1); }).toQuery();
    const expected = "?$filter=name eq 'John Doe' and id eq 1";
    expect(query).toEqual(expected);
  });
  it('should return filter with or operator', () => {
    const query = new QueryBuilder().filter(f => f.or(a => { a.eq('name', 'John Doe'); a.eq('id', 1); })).toQuery();
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
      f.or(o => {
        o.eq('name', 'John Doe');
        o.eq('id', 1);
        o.and(a => {
          a.eq('name', 'Jane');
          a.eq('rating', 5);
        })
      })
    )
      .toQuery();
    const expected = "?$filter=name eq 'John Doe' or id eq 1 or (name eq 'Jane' and rating eq 5)";
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
  const expected = "?$top=10&$skip=10&$count=true&$select=name&$orderBy=name&$expand=Books($select=title)&$filter=name eq 'John Doe'";
  expect(query).toEqual(expected);
});
