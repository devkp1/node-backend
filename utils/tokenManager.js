const blacklistedTokens = new Set();

export const blacklistedToken = async (token) => {
  blacklistedTokens.add(token);
};

export const isTokenBlackListed = (token) => {
  return blacklistedTokens.has(token);
};
