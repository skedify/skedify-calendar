const MAX_ARRAY_LENGTH = 2 ** 32 - 1;

export function range(n) {
  if (n < 0 || n > MAX_ARRAY_LENGTH) {
    throw new Error(
      `You called \`range(${n})\`, but the input \`n\` should be greater or equals to 0 and less than or equals to ${MAX_ARRAY_LENGTH}.`
    );
  }

  return Array(...Array(n)).map((x, i) => i);
}
