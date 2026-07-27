import * as bcrypt from 'bcrypt';

let generatedSalt: string | null = null;
export async function hashString(input: string): Promise<string> {
  if (!generatedSalt) {
    generatedSalt = await bcrypt.genSalt(10);
  }
  return await bcrypt.hash(input, generatedSalt);
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
