export type DescriptionMeta = {
  description?: string;
  __decorators?: any;
};

function safeParse(s: string): any {
  // treat empty parens as true, eg +ignore()
  if (!s) return true;
  try {
    return JSON.parse(s);
  } catch {
    return `INVALID_JSON: ${s}`;
  }
}

type Maybe<P> = P | null | undefined;

export function parseDescriptionDecorators(
  description: Maybe<string>
): DescriptionMeta {
  if (!description) return {};

  const reDecorators = /^\s*\+([a-z]([a-zA-z_])*)\(([^)]*)\)\s*$/gm;
  const reNewline = /^$|^\s+|\s+$|\n\n/gm;

  let m;
  let desc = '';
  let startIndex = 0;
  let meta = {} as Record<string, any>;
  let hasMeta = false;
  while ((m = reDecorators.exec(description)) !== null) {
    desc += description.substring(startIndex, m.index);

    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === reDecorators.lastIndex) {
      reDecorators.lastIndex++;
    }

    startIndex = reDecorators.lastIndex;

    // 1 is decorator name
    // 3 is value within parens
    meta[m[1]] = safeParse(m[3]);
    hasMeta = true;
  }

  if (startIndex === 0) {
    desc = description;
  } else if (startIndex < description.length) {
    desc += description.substring(startIndex);
  }

  desc = desc.replace(reNewline, '');

  const result: DescriptionMeta = {};
  if (desc) result.description = desc.trim(); // TODO regex not catching first blank line
  if (hasMeta) result.__decorators = meta;

  return result;
}
