export const MAX_USER_ADDRESSES = 5;

export function canAddMoreAddresses(count: number) {
  return count < MAX_USER_ADDRESSES;
}
