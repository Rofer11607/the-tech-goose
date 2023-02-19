export function titleCaseToSnakeCase(input: string) {
  const output = input.split(' ').join('');
  return `${output.charAt(0).toLowerCase()}${output.slice(1)}`;
}
