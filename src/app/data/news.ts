export interface GalleryItem {
  title: string;
  picture: string;
  date: string;
};

export interface NewsItem {
    id: string;
    title: string;
    customerName: string;
    description: string;
    date: string;
    location: string;
    duration: string;
    contact: string;
    picture: string;
    gallery: {
      title: string;
      date: string;
      picture: string;
    }[];
  }
  
  export const newsData: NewsItem[] = [
    {
      id: "1",
      title: "Travel to Marinduque",
      customerName: "Jake Mayores",
      description: "On December 20, 2024, experience the scenic journey...",
      date: "December 20, 2024",
      location: "Marinduque, Philippines",
      duration: "5 days",
      contact: "info@travelmarinduque.com",
      picture: "/images/mg_car.jpg",
      gallery: [
        {
          title: "Baguio Pine Trees",
          date: "November 11, 2024",
          picture: "/images/blueLogo.png",
        },
        {
          title: "The Famous Lion's Head",
          date: "November 12, 2024",
          picture: "/images/mg_car.jpg",
        }
      ],
    },
    {
      id: "2",
      title: "Road Trip to Baguio",
      customerName: "Justine Mayores",
      description: "On November 10, 2024, set off for a refreshing road trip...",
      date: "November 10, 2024",
      location: "Baguio, Philippines",
      duration: "3 days",
      contact: "info@roadtripbaguio.com",
      picture: "/images/mg_car.jpg",
      gallery: [
        
        {
          title: "Sunset View in Marinduque",
          date: "December 21, 2024",
          picture: "/images/image1.png",
        },
        {
          title: "Scenic Beaches",
          date: "December 22, 2024",
          picture: "/images/image2.png",
        },
        {
          title: "Sunset View in Marinduque",
          date: "December 21, 2024",
          picture: "/images/image3.png",
        },
        {
          title: "Scenic Beaches",
          date: "December 22, 2024",
          picture: "/images/monggi.png",
        },
      ],
    },
  ];
  