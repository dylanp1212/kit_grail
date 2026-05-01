export function sizeToSymbol(size: string): string {
  const symbols = {'xsmall': 'XS', 'small': 'S', 'medium': 'M',
    'large': 'L', 'xlarge': 'XL'}
  return (symbols[size]);
}