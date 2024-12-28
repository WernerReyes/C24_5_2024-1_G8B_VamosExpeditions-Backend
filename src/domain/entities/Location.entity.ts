export class LocationEntity {
    constructor(
      public readonly id: number,
      public readonly name: string,
      public readonly country: { id: number; name: string }
    ) {}
  
    public static fromObject(object: { [key: string]: any }): LocationEntity {
      const { id_city, name, country } = object;
      return new LocationEntity(id_city, name, country);
    }
  }
  