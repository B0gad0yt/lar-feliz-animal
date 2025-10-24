export type Animal = {
  id?: string; // Firestore ID will be added on fetch
  name: string;
  species: 'Cachorro' | 'Gato' | 'Coelho';
  breed: string;
  age: number; // in years
  size: 'Pequeno' | 'Médio' | 'Grande';
  gender: 'Macho' | 'Fêmea';
  description: string;
  story: string;
  personality: string[];
  health: string[];
  photos: string[];
  shelterId: string;
};

export type Shelter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

export type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'user' | 'admin';
};
