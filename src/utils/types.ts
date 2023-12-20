
export type SearchDogsParams = {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
  }

export type Dog = {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}