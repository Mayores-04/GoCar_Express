export interface carsType {
  Name: string;
  Brand: string;
  Seats: number;
  Picture: string;
  Description: string;
}

export const Cars: carsType[] = [
  {
    Name: "MG ZS",
    Brand: "MG",
    Seats: 5,
    Picture: "/images/mg_car.jpg",
    Description:
      "The MG ZS is a compact SUV offering a blend of style, practicality, and affordability. It features a 1.5-liter engine producing 112 horsepower, with a 0 to 100 km/h time of approximately 10.9 seconds. The car is equipped with modern tech such as a 12.3-inch touchscreen display and advanced safety features.",
  },
  // {
  //   Name: "Toyota Corolla",
  //   Brand: "Toyota",
  //   Seats: 5,
  //   Picture: "/images/image1.png",
  //   Description:
  //     "The Toyota Corolla is a reliable and fuel-efficient compact sedan. With a 1.6-liter engine, it offers comfortable ride quality and longevity. The Corolla comes with a modern infotainment system, a touchscreen display, and advanced safety features such as Toyota Safety Sense.",
  // },
  // {
  //   Name: "Honda Civic",
  //   Brand: "Honda",
  //   Seats: 5,
  //   Picture: "/images/image2.png",
  //   Description:
  //     "The Honda Civic is a compact car known for its sporty performance and practicality. It features a 1.5-liter engine producing 180 horsepower and 240 Nm of torque. The Civic provides a refined interior with a 9-inch navigation system and a spacious cabin, making it an ideal choice for those who want performance and comfort.",
  // },
];
