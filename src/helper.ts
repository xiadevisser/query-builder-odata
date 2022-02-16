export function replaceSpecialCharacters(field: string): string {
  field = field.replace(/'/g, '\'\'');

  field = field.replace(/%/g, '%25');
  field = field.replace(/\+/g, '%2B');
  field = field.replace(/\//g, '%2F');
  field = field.replace(/\?/g, '%3F');

  field = field.replace(/#/g, '%23');
  field = field.replace(/&/g, '%26');
  return field;
}