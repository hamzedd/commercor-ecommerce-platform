import * as bcrypt from 'bcrypt';

export async function hashString(input: string): Promise<string> {
  return await bcrypt.hash(input, await bcrypt.genSalt(12));
}

export async function compareHashString({
  input,
  hash,
}: {
  input: string;
  hash: string;
}): Promise<boolean> {
  return await bcrypt.compare(input, hash);
}
