
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReservationPage(){
    return (
        <>
            <header>
                <Header />
            </header>
            <section className="py-16 pt-24 justify-center items-center">
                <div>
                    <h1>Reservation Page</h1>
                </div>
            </section>
            <footer className="bottom-0">
                <Footer />
            </footer>
        </>
    );
}