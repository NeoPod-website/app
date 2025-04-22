const shortAddress = (address, letters = 8) => {
  const prefix = address.slice(0, letters);
  const suffix = address.slice(-4);

  return `${prefix}...${suffix}`;
};

export default shortAddress;
