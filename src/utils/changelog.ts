export const getVersionsFromChangelog = (
  rawContent: string, 
  versions: string | string[]
): string => {
  const versionList = Array.isArray(versions) ? versions : [versions];
  const extractedSections: string[] = [];

  versionList.forEach((v) => {
    const regex = new RegExp(`## \\[${v.replace('.', '\\.')}\\]([\\s\\S]*?)(?=## \\[|$)`, 'g');
    const match = regex.exec(rawContent);
    
    if (match) {
      extractedSections.push(`## [${v}]${match[1].trim()}`);
    }
  });

  return extractedSections.join('\n\n');
};

export const getAllVersionsFromChangelog = (rawContent: string): string[] => {
  const regex = /## \[([\d.]+)\]/g;
  const versions: string[] = [];
  let match;

  while ((match = regex.exec(rawContent)) !== null) {
    versions.push(match[1]);
  }

  return versions;
};