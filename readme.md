# query-builder-odata

query-builder-odata builds OData v4 queries.

![Action Status](https://github.com/xiadevisser/query-builder-odata/actions/workflows/build.yml/badge.svg)

## Install

```
yarn add query-builder-odata
```

or

```
npm install --save query-builder-odata
```

### Create a query

```
const query = new QueryBuilder()
  .top(10)
  .skip(10)
  .count()
  .select('name')
  .orderBy('name')
  .expand('Books', e => e.select('title'))
  .filter(f => f.eq('name', 'John Doe'))
  .toQuery();
```
query => `"?$top=10&$skip=10&$count=true&$select=name&$orderBy=name&$expand=Books($select=title)&$filter=name eq 'John Doe'"`

## Usage

- [Pagination](#pagination)
  - [Top](#top)
  - [Skip](#skip)
- [Counting](#counting)
- [Selecting](#selecting)
- [Ordering](#ordering)
- [Expanding](#expanding)
  - [Nested expand](#nested-expand)
  - [Nested expand with other queries](#nested-expand-with-other-queries)
- [Filtering](#filtering)
  - [Comparison operator](#comparison-operator)
  - [Logical operator](#logical-operator)


### Pagination

#### Top

```
const query = new QueryBuilder()
  .top(10)
  .toQuery();
```

query => `"?$top=10"`

#### Skip

```
const query = new QueryBuilder()
  .skip(10)
  .toQuery();
```

query => `"?$skip=10"`

### Counting

```
const query = new QueryBuilder()
  .count()
  .toQuery();
```

query => `"?$count=true"`

### Selecting

```
const query = new QueryBuilder()
  .select('id,name')
  .toQuery();
```

query => `"?$select=id,name"`

### Ordering

```
const query = new QueryBuilder()
  .orderBy('id desc,name')
  .toQuery();
```

query => `"?$orderBy=id desc,name"`

### Expanding

```
const query = new QueryBuilder()
  .expand('Books')
  .toQuery();
```

query => `"?$expand=Books"`

#### Nested expand

```
const query = new QueryBuilder()
  .expand('Books', e =>
    e.expand('Chapters')
  )
  .toQuery();
```

query => `"?$expand=Books($expand=Chapters)"`

#### Nested expand with other queries

Expand can be used together with `top, skip, count, select, orderBy, filter`

```
const query = new QueryBuilder()
  .expand('Books', e => {
    e.select('title');
    e.orderBy('isbn');
  })
  .toQuery();
```

query => `"?$expand=Books($select=title;$orderBy=isbn)"`

### Filtering

```
const query = new QueryBuilder()
  .filter(f => f.eq('name', 'John Doe'))
  .toQuery();
```

query => `"?$filter=name eq 'John Doe'"`

#### Comparison operator

Supported operators:
- `eq, ne, gt, ge, lt, le, in`
- `startswith, endswith, contains`

When using multiple operators, the logical `and` operator is used by default.

```
const query = new QueryBuilder()
  .filter(f => {
    f.startsWith('name', 'John');
    f.gt('rating', 5);
  })
  .toQuery();
```

query => `"?$filter=startswith(name, 'John') and rating gt 5"`

#### Logical operator

Supported operators: `and, or`

```
const query = new QueryBuilder()
  .filter(f =>
    f.or(o => {
      o.startsWith('name', 'John');
      o.gt('rating', 5);
    })
  )
  .toQuery();
```

query => `"?$filter=startswith(name, 'John') or rating gt 5"`
