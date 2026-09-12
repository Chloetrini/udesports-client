
// The backend sends DOB as an ISO 8601 date string (Prisma DateTime,
// e.g. "2004-01-27T00:00:00.000Z" — JS Date parses this natively via
// new Date(dob). This used to assume a "DD/MM/YYYY" slash format instead,
// which never matched what the API actually sends and always produced NaN.
export function getAge(dob: string) {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return NaN;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// console.log(getAge("2004-01-27T00:00:00.000Z")); // 22 as of 27 June 2026
