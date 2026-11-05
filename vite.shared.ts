const pkg = (names: string) => new RegExp(`[\\\\/]node_modules[\\\\/](${names})[\\\\/]`);

export const vendorChunks = {
  groups: [
    { name: 'react', test: pkg('react|react-dom|react-router|scheduler') },
    { name: 'data', test: pkg('@tanstack|zustand|zod|i18next|react-i18next') },
  ],
};
