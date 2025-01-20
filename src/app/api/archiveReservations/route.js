const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db('your-database-name');
const reservationsCollection = database.collection('reservations');
const archiveCollection = database.collection('archive');

export async function POST(req) {
  try {
    const { reservationId } = await req.json();

    // Fetch the reservation by ID
    const reservation = await reservationsCollection.findOne({ _id: new ObjectId(reservationId) });

    if (!reservation) {
      return NextResponse.json({ success: false, message: 'Reservation not found' }, { status: 404 });
    }

    // Insert the reservation into the archive collection
    await archiveCollection.insertOne(reservation);

    // Delete the reservation from the main collection
    await reservationsCollection.deleteOne({ _id: new ObjectId(reservationId) });

    return NextResponse.json({ success: true, message: 'Reservation archived and deleted successfully' });
  } catch (error) {
    console.error('Error archiving reservation:', error);
    return NextResponse.json({ success: false, message: 'Failed to archive reservation' }, { status: 500 });
  }
}
