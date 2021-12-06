# query-builder-odata

query-builder-odata builds OData v4 queries.

[![NPM Version](https://img.shields.io/npm/v/query-builder-odata)](https://www.npmjs.com/package/query-builder-odata)
[![Action Status](https://github.com/xiadevisser/query-builder-odata/actions/workflows/build.yml/badge.svg)](https://github.com/xiadevisser/query-builder-odata)
[![Coverage Status](https://coveralls.io/repos/github/xiadevisser/query-builder-odata/badge.svg)](https://coveralls.io/github/xiadevisser/query-builder-odata)
[![License](https://img.shields.io/github/license/xiadevisser/query-builder-odata)](/LICENSE)

## Installation

```
yarn add query-builder-odata
```

or

```
npm install --save query-builder-odata
```

### Create a query

```js
import { QueryBuilder } from 'query-builder-odata';

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
query => `"?$top=10&$skip=10&$count=true&$select=name&$orderby=name&$expand=Books($select=title)&$filter=name eq 'John Doe'"`

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
- [Duplicate query operators](#duplicate-query-operators)

### Pagination

#### Top

```js
const query = new QueryBuilder()
  .top(10)
  .toQuery();
```

query => `"?$top=10"`

#### Skip

```js
const query = new QueryBuilder()
  .skip(10)
  .toQuery();
```

query => `"?$skip=10"`

### Counting

```js
const query = new QueryBuilder()
  .count()
  .toQuery();
```

query => `"?$count=true"`

### Selecting

```js
const query = new QueryBuilder()
  .select('id', 'name')
  .toQuery();
```

query => `"?$select=id,name"`

### Ordering

```js
const query = new QueryBuilder()
  .orderBy('id desc' ,'name')
  .toQuery();
```

query => `"?$orderBy=id desc,name"`

### Expanding

```js
const query = new QueryBuilder()
  .expand('Books')
  .toQuery();
```

query => `"?$expand=Books"`

#### Nested expand

```js
const query = new QueryBuilder()
  .expand('Books', e =>
    e.expand('Chapters')
  )
  .toQuery();
```

query => `"?$expand=Books($expand=Chapters)"`

#### Nested expand with other queries

Expand can be used together with `top, skip, count, select, orderBy, filter`

```js
const query = new QueryBuilder()
  .expand('Books', e => e
    .select('title')
    .orderBy('isbn')
  )
  .toQuery();
```

query => `"?$expand=Books($select=title;$orderBy=isbn)"`

### Filtering

```js
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

```js
const query = new QueryBuilder()
  .filter(f => f
    .startsWith('name', 'John')
    .gt('rating', 5)
  )
  .toQuery();
```

query => `"?$filter=startswith(name, 'John') and rating gt 5"`

#### Logical operator

Supported operators: `and, or`

```js
const query = new QueryBuilder()
  .filter(f =>
    f.or(o => o
      .startsWith('name', 'John')
      .gt('rating', 5)
    )
  )
  .toQuery();
```

query => `"?$filter=startswith(name, 'John') or rating gt 5"`

### Duplicate query operators

When adding multiple query operators of the same type, one of two scenarios will happen: overriding or addition.

#### Overriding

The following operators will override the existing value: `top, skip, count`

```js
const query = new QueryBuilder()
  .top(10)
  .top(15)
  .toQuery();
```

query => `"?$top=15"`

#### Addition

The following operators will add to the existing value: `select, orderBy, expand, filter`

```js
const query = new QueryBuilder()
  .select('name')
  .select('age')
  .toQuery();
```

query => `"?$select=name,age"`

More examples can be found in the [tests](test/query-builder.test.ts).