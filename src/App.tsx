import { useEffect } from "react";
import Header from "./components/Header";
import WhatsAppButton from "./components/WhatsAppButton";
import PremiumServices from "./components/PremiumServices";
import { Hero, Services, Projects, About, Process, Testimonials, Contact, Footer } from "./components/Sections";
import { client } from "./sanityClient";

export default function App() {

  useEffect(() => {
    // Fetch data from Sanity
    const fetchData = async () => {
      try {
        const query = `*[_type == "project"]{title, description, "imageUrl": image.asset->url}`;
        const projects = await client.fetch(query);
        console.log("Projects from Sanity:", projects);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  return (<><Header /><main><Hero /><PremiumServices /><Services /><About /><Process /><Testimonials /><Contact /></main><Footer /><WhatsAppButton /></>);
}
