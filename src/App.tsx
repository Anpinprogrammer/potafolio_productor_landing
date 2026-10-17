import Header from "./components/Header";
import WhatsAppButton from "./components/WhatsAppButton";
import PremiumServices from "./components/PremiumServices";
import { Hero, Services, Projects, About, Process, Testimonials, Contact, Footer } from "./components/Sections";

export default function App() {

  return (<><Header /><main><Hero /><PremiumServices /><Services /><About /><Process /><Testimonials /><Contact /></main><Footer /><WhatsAppButton /></>);
}
