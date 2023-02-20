
export function validateProjectName(name: string) {
  const regex = /^[a-z]+$/;
  if (!regex.test(name)) {
    throw new Error("Project name can only contain lowercase letters.");
  }
}
