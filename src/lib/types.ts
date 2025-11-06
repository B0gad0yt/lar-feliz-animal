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
  photos: string[]; // data URIs
  shelterId: string;
  createdBy?: string; // UID of the user who created the animal
  createdAt?: any;
  updatedAt?: any;
  // Foster to adoption migration fields
  movedFromTemporary?: boolean;
  originalTemporaryId?: string;
  movedAt?: any;
};

export type Shelter = {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  createdAt?: any;
  updatedAt?: any;
};

export type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'operator' | 'user';
};

export type SocialLink = {
  platform: "Instagram" | "Twitter" | "Facebook" | "YouTube" | "LinkedIn" | "GitHub";
  url: string;
}

export type SiteConfig = {
    id?: string;
    title: string;
    socialLinks: SocialLink[];
}

export type AdoptionApplication = {
  id?: string;
  animalId: string;
  animalName: string;
  animalPhoto?: string | null;
  shelterId: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  residenceType: 'Casa' | 'Apartamento';
  hasOtherPets: string;
  reason: string;
  agreement: boolean;
  humanProof: string;
  status: 'pending' | 'accepted' | 'adopted';
  createdAt?: any;
  handledBy?: string;
  handledAt?: any;
};

export type TemporaryAnimal = Animal;

export type FosterApplication = Omit<AdoptionApplication, 'status' | 'reason'> & {
  status: 'pending' | 'approved' | 'completed';
  availability?: string;
  experience?: string;
  animalMovedToAdoption?: boolean;
};
