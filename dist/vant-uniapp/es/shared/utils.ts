export function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (item) => `-${item.toLowerCase()}`);
}

export function createNamespace(name: string) {
  const prefixedName = `van-${name}`;

  return {
    name: prefixedName,
    bem(
      element?: string,
      modifiers?: Array<string | Record<string, boolean | undefined>> | Record<string, boolean | undefined>
    ) {
      const base = element ? `${prefixedName}__${element}` : prefixedName;
      const classes = [base];
      const normalizedModifiers = Array.isArray(modifiers)
        ? modifiers
        : modifiers
          ? [modifiers]
          : [];

      normalizedModifiers.forEach((modifier) => {
        if (typeof modifier === 'string' && modifier) {
          classes.push(`${base}--${modifier}`);
          return;
        }

        Object.entries(modifier).forEach(([key, enabled]) => {
          if (enabled) {
            classes.push(`${base}--${toKebabCase(key)}`);
          }
        });
      });

      return classes;
    },
  };
}

export function normalizeStyle(
  style?: string | Record<string, string | number>
) {
  if (!style) {
    return '';
  }

  if (typeof style === 'string') {
    return style;
  }

  return Object.entries(style)
    .map(([key, value]) => `${toKebabCase(key)}: ${value}`)
    .join(';');
}

export function addUnit(value?: string | number) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}
