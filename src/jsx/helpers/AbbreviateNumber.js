const abbreviateNumber = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return `${(parseInt(n / 1e3, 10).toLocaleString('en-US'))}K`;
  if (n >= 1e6 && n < 1e9) return `${parseInt(n / 1e6, 10).toLocaleString('en-US')}M`;
  return `${parseInt(n / 1e9, 10).toLocaleString('en-US')}B`;
};

export default abbreviateNumber;
