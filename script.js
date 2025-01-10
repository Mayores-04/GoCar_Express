const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://jakemayores05:J%40k3m%40y0r3s@cluster0.ss74b.mongodb.net/car_rental_website', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Define the car schema
    const carSchema = new mongoose.Schema({
      name: String,
      brand: String,
      seats: Number,
      picture: String,
      description: String
    });

    // Create the Car model
    const Car = mongoose.model('Car', carSchema);

    // Create a new car document
    const car = new Car({
      name: 'Car Name',
      brand: 'Car Brand',
      seats: 4,
      picture: '/path/to/car-image.jpg',
      description: 'Description of the car'
    });

    // Save the car to the database
    car.save()
      .then(() => {
        console.log('Car saved to database');
        mongoose.connection.close(); // Close the connection when done
      })
      .catch((err) => {
        console.error('Error saving car:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
