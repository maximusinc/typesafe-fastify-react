interface User {
  id: number;
  name: string;
  email: string;
}


export const getUser = async (id: string): Promise<User> => {
  return {
    id: Number(id),
    name: 'John Doe',
    email: 'test@example.com'
  };

}