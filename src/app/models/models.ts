export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  parentId?: string; // it will be set when it is a reply
}
export interface Inquiry {
  id: string;
  listingId: string;
  fromUserId: string;
  fromName: string;
  fromEmail: string;
  message: string;
  createdAt: string;
}
export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  sharedProperty: boolean;
  sqft: number;
  leaseType: 'long' | 'short' | 'both';
  rent: number;
  negotiable: boolean;
  priceMode: 'perMonth' | 'utilitiesIncluded';
  furnished: boolean;
  amenities: string[];
  photos: string[];
  contact: string;
  createdAt: string;
  featured?: boolean;
  propertyType?: string;
  propertyName?: string;
  beds?: number;
}
